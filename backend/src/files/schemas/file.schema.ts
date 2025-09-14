import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid'; // <-- Import uuid

@Schema()
export class Chunk {
  @Prop({ required: true })
  chunkNumber: number;

  @Prop({ required: true })
  filePath: string;
}
export const ChunkSchema = SchemaFactory.createForClass(Chunk);

@Schema({ timestamps: true })
export class FileMetadata {
  // --- Start of Changes ---
  @Prop({ type: String, default: () => uuidv4() })
  _id: string;
  // --- End of Changes ---

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true })
  totalChunks: number;

  @Prop({ type: [ChunkSchema], required: true })
  chunks: Chunk[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  owner: MongooseSchema.Types.ObjectId;
}

export type FileMetadataDocument = FileMetadata & Document;
export const FileMetadataSchema = SchemaFactory.createForClass(FileMetadata);