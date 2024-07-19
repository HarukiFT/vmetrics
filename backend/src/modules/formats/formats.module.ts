import { Module } from '@nestjs/common';
import { FormatsController } from './formats.controller';
import { FormatsService } from './formats.service';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [ProjectsModule],
  controllers: [FormatsController],
  providers: [FormatsService]
})
export class FormatsModule {}
