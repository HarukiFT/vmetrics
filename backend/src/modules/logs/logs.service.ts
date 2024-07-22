import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { LogDocument } from './schemas/logs.schema';
import { CreateLogDto } from './dto/create-log.dto';
import { DistinctFieldAggregation } from './aggregations/distinct-fields';
import { FormatsService } from '../formats/formats.service';

@Injectable()
export class LogsService {
    constructor(@InjectModel('Log') private readonly logModel: Model<LogDocument>, private readonly formatsService: FormatsService) {}

    async getLogs(projectId: string, filter: Record<string, any>, limit: number, page: number) {
        const projectOID = mongoose.Types.ObjectId.createFromHexString(projectId)

        const logs = await this.logModel.find({
            ...filter,
            project: projectOID
        }).skip(limit * (page - 1)).limit(limit)

        const resposneDocuments = []

        for (let logDocument of logs) {
            const formatDoc = await this.formatsService.getFormatLog(projectId, logDocument.action, logDocument)

            resposneDocuments.push({
                action: logDocument.action,
                timestamp: logDocument.timestamp,
                string: formatDoc?.string,
                params: formatDoc?.params
            })
        }

        return resposneDocuments
    }

    async countLogs(projectId: string, filter: Record<string, any>) {
        const projectOID = mongoose.Types.ObjectId.createFromHexString(projectId)

        return await this.logModel.countDocuments({
            ...filter,
            project: projectOID
        })
    }

    async getActions(projectId: string) {
        const projectOID = mongoose.Types.ObjectId.createFromHexString(projectId)

        return await this.logModel.distinct('action', {
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
