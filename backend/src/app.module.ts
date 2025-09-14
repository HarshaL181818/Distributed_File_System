import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot('mongodb+srv://testuser:HQeKMJDKgQdu1jbh@cluster0.5xnfene.mongodb.net/filechunks?retryWrites=true&w=majority&appName=Cluster0'),
    AuthModule,
    UsersModule,
    FilesModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}