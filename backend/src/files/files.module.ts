import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { FileMetadata, FileMetadataSchema } from './schemas/file.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: FileMetadata.name, schema: FileMetadataSchema }]),
    JwtModule.register({ // Needed for signing shareable links
      secret: `${process.env.JWT_SECRET_KEY}`,
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}