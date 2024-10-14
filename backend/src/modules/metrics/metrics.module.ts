import { Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectsModule } from '../projects/projects.module';
import { MetricSchema } from './schemas/metric.schema';
import { ProjectSchema } from '../projects/schemas/project.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Metric', schema: MetricSchema },
      { name: 'Project', schema: ProjectSchema },
    ]),
    ProjectsModule,
  ],
  providers: [MetricsService],
  controllers: [MetricsController],
})
export class MetricsModule {}
