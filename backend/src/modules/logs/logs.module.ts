import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { LogSchema } from './schemas/logs.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [MongooseModule.forFeature([{name: 'Log', schema: LogSchema}]), ProjectsModule],
  providers: [LogsService],
  controllers: [LogsController]
})
export class LogsModule {}
