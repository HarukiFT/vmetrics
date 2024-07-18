import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { LogDocument } from './schemas/logs.schema';
import { CreateLogDto } from './dto/create-log.dto';
import { DistinctFieldAggregation } from './aggregations/distinct-fields';

@Injectable()
export class LogsService {
    constructor(@InjectModel('Log') private readonly logModel: Model<LogDocument>) {}

    async getLogs(projectId: string, filter: Record<string, any>) {
        const projectOID = mongoose.Types.ObjectId.createFromHexString(projectId)

        return await this.logModel.find({
            ...filter,
            project: projectOID
        })
    }

    async getLogsFields(projectId: string, filter: Record<string, any>) {
        const projectOID = mongoose.Types.ObjectId.createFromHexString(projectId)

        const aggregationResult = await this.logModel.aggregate(DistinctFieldAggregation({
            ...filter,
            project: projectOID
        }))

        return aggregationResult.map((doc) => doc.field)
    }

    async createLog(projectId: string, createLogDto: CreateLogDto): Promise<undefined> {
        const projectOID = mongoose.Types.ObjectId.createFromHexString(projectId)
        const timestamp = createLogDto.timestamp ?? new Date()

        await new this.logModel({...createLogDto, timestamp, project: projectOID}).save()
    }
}
