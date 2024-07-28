import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { MetricDocument } from './schemas/metric.schema';
import { CreateMetricDto } from './dto/create-metric.dto';

@Injectable()
export class MetricsService {
    constructor(@InjectModel('Metric') private readonly metricsModel: Model<MetricDocument>) {}

    async createMetric(projectId: string, createMetricDto: CreateMetricDto): Promise<undefined> {
        const projectOID = mongoose.Types.ObjectId.createFromHexString(projectId)
        
        const timestampDate = new Date(createMetricDto.timestamp)
        
        await new this.metricsModel({
            timestamp: timestampDate, 
            value: createMetricDto.value, 
            project: projectOID, 
            metadata: createMetricDto.clarification ? { clarification: createMetricDto.clarification } : undefined})
            .save()
    }
}
