import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { LogDocument } from './schemas/logs.schema';
import { CreateLogDto } from './dto/create-log.dto';

@Injectable()
export class LogsService {
    constructor(@InjectModel('Log') private readonly logModel: Model<LogDocument>) {}

    async createLog(projectId: string, createLogDto: CreateLogDto): Promise<undefined> {
        const projectOID = mongoose.Types.ObjectId.createFromHexString(projectId)

        await new this.logModel({...createLogDto, project: projectOID}).save()
    }
}
