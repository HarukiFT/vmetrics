import { Module } from '@nestjs/common';
import { FormatsController } from './formats.controller';
import { FormatsService } from './formats.service';
import { ProjectsModule } from '../projects/projects.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FormatSchema } from './schemas/format.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: 'Format', schema: FormatSchema}]), ProjectsModule, AuthModule],
  controllers: [FormatsController],
  providers: [FormatsService],
  exports: [MongooseModule, FormatsService]
})
export class FormatsModule {}
