import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { LogSchema } from './schemas/logs.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectsModule } from '../projects/projects.module';
import { AuthModule } from '../auth/auth.module';
import { FormatsModule } from '../formats/formats.module';

@Module({
  imports: [MongooseModule.forFeature([{name: 'Log', schema: LogSchema}]), ProjectsModule, AuthModule, FormatsModule],
  providers: [LogsService],
  controllers: [LogsController]
})
export class LogsModule {}
