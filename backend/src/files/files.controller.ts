import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, UseGuards, Req, Res, UnauthorizedException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FilesService } from './files.service';
import { diskStorage } from 'multer';
import type { Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage: diskStorage({ destination: './temp_uploads' }) }))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req) {
    return this.filesService.uploadFile(file, req.user.userId);
  }

  @Get('download/:fileId')
  async downloadFile(@Param('fileId') fileId: string, @Res() res: Response) {
    // This is a public download endpoint. For protected, you'd add a guard.
    res.setHeader('Content-Disposition', `attachment;`);
    await this.filesService.reassembleAndStreamFile(fileId, res);
  }

  // Pre-signed URL download
  @Get('download-by-token')
  async downloadByToken(@Req() req, @Res() res: Response) {
    const token = req.query.token as string;
    if (!token) throw new UnauthorizedException();
    try {
      const payload = this.jwtService.verify(token);
      res.setHeader('Content-Disposition', `attachment;`);
      await this.filesService.reassembleAndStreamFile(payload.fileId, res);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('share/:fileId')
  async getShareQrCode(@Param('fileId') fileId: string) {
    const qrCodeDataUrl = await this.filesService.generateShareableQrCode(fileId);
    return { qrCode: qrCodeDataUrl };
  }
}