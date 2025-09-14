import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileMetadata, FileMetadataDocument } from './schemas/file.schema';
import * as fs from 'fs/promises';
import * as path from 'path';
import { createReadStream, createWriteStream } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import * as QRCode from 'qrcode';
import { JwtService } from '@nestjs/jwt';
import { Writable } from 'stream';

import * as os from 'os'; // 1. Import the 'os' module

const CHUNK_SIZE = 1024 * 1024 * 5; // 5MB
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  constructor(
    @InjectModel(FileMetadata.name) private fileMetadataModel: Model<FileMetadataDocument>,
    private jwtService: JwtService,
  ) {
    // Ensure upload directory exists
    fs.mkdir(UPLOAD_DIR, { recursive: true });
  }

  async uploadFile(file: Express.Multer.File, userId: string): Promise<FileMetadata> {
    const startTime = Date.now();
    const fileId = uuidv4();
    const fileDir = path.join(UPLOAD_DIR, fileId);
    await fs.mkdir(fileDir, { recursive: true });

    let chunkNumber = 0;
    const chunks: { chunkNumber: number; filePath: string }[] = [];
    const readStream = createReadStream(file.path);

    for await (const chunk of this.chunkStream(readStream, CHUNK_SIZE)) {
      const chunkPath = path.join(fileDir, `chunk-${chunkNumber}`);
      await fs.writeFile(chunkPath, chunk);
      chunks.push({ chunkNumber, filePath: chunkPath });
      chunkNumber++;
    }

    const metadata = new this.fileMetadataModel({
      _id: fileId,
      originalName: file.originalname,
      mimeType: file.mimetype,
      totalChunks: chunks.length,
      chunks: chunks,
      owner: userId,
    });

    await metadata.save();
    await fs.unlink(file.path); // Clean up temp file from multer

    const latency = Date.now() - startTime;
    this.logger.log(`File ${file.originalname} uploaded in ${latency}ms.`);
    return metadata;
  }

  async reassembleAndStreamFile(fileId: string, writableStream: Writable): Promise<void> {
    const startTime = Date.now();
    const metadata = await this.fileMetadataModel.findById(fileId).exec();
    if (!metadata) throw new NotFoundException('File not found');

    metadata.chunks.sort((a, b) => a.chunkNumber - b.chunkNumber);

    for (const chunk of metadata.chunks) {
      await new Promise<void>((resolve, reject) => {
        const readStream = createReadStream(chunk.filePath);
        readStream.pipe(writableStream, { end: false });
        readStream.on('end', resolve);
        readStream.on('error', reject);
      });
    }
    writableStream.end();
    
    const latency = Date.now() - startTime;
    this.logger.log(`File ${metadata.originalName} downloaded in ${latency}ms.`);
  }

  async generateShareableQrCode(fileId: string): Promise<string> {
    const metadata = await this.fileMetadataModel.findById(fileId).exec();
    if (!metadata) throw new NotFoundException('File not found');
    
    const payload = { fileId };
    const token = this.jwtService.sign(payload, { expiresIn: '10m' });
    
    // --- Start of Changes ---
    const localIp = this.getLocalIpAddress();
    
    // 2. Use the dynamic IP address instead of 'localhost'
    const downloadUrl = `http://${localIp}:3000/download?token=${token}`;
    // --- End of Changes ---

    return QRCode.toDataURL(downloadUrl);
  }

  // 3. Add this helper function to the class
  // backend/src/files/files.service.ts

// backend/src/files/files.service.ts

private getLocalIpAddress(): string {
  const interfaces = os.networkInterfaces();
  
  // Look specifically for the 'Wi-Fi' interface
  console.log(interfaces)
  const wifiInterface = interfaces['Wi-Fi'];

  if (wifiInterface) {
    for (const net of wifiInterface) {
      if (net.family === 'IPv4' && !net.internal) {
        // Found the Wi-Fi IPv4 address
        return net.address;
      }
    }
  }

  // If Wi-Fi adapter is not found or has no IPv4, fallback to localhost
  return 'localhost'; 
}
  
  // Helper to chunk a stream
  private async *chunkStream(stream: NodeJS.ReadableStream, size: number) {
    let buffer = Buffer.alloc(0);
    for await (const chunk of stream) {
      const chunkAsBuffer = Buffer.from(chunk); // <-- Ensure chunk is a buffer
      buffer = Buffer.concat([buffer, chunkAsBuffer]); // <-- Use the buffer
      while (buffer.length >= size) {
        yield buffer.slice(0, size);
        buffer = buffer.slice(size);
      }
    }
    if (buffer.length > 0) {
      yield buffer;
    }
  }
}