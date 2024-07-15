import { Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose';
import { ProjectDocument } from './schemas/project.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { ConfigService } from '@nestjs/config';
import { UserPayload } from 'src/shared/interfaces/user-payload.interface';

const getApiKey = (length: number) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_.';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

@Injectable()
export class ProjectsService {
    constructor(@InjectModel('Project') private readonly projectModel: Model<ProjectDocument>, private readonly configService: ConfigService) {}

    async createProject(owner: UserPayload, createProjectDto: CreateProjectDto) {
        const apiKey = getApiKey(this.configService.get<number>('API_LENGTH'))

        await new this.projectModel({
            name: createProjectDto.name,
            apiKey: apiKey,
            timestamp: new Date(),
            owner: mongoose.Types.ObjectId.createFromHexString(owner._id)
        }).save()
    }

    async fetchProjects(owner: UserPayload) {
        const userOID = mongoose.Types.ObjectId.createFromHexString(owner._id)

        return await this.projectModel.find({
            owner: userOID
        })
    }
}
