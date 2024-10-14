import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BanDocument } from './schemas/bans.schema';
import mongoose, { Model } from 'mongoose';
import { BanRecordDto } from './dto/ban-record.dto';
import { ProjectsService } from '../projects/projects.service';
import OpenCloud from 'src/shared/opencloud';

@Injectable()
export class BansService {
  constructor(
    @InjectModel('Ban') private banModel: Model<BanDocument>,
    private projectService: ProjectsService,
  ) {}

  async banTarget(projectId: string, dto: BanRecordDto) {
    const project = await this.projectService.getProject(projectId);

    await this.banModel.create({
      publicReason: dto.publicReason,
      project: mongoose.Types.ObjectId.createFromHexString(projectId),
      privateReason: dto.privateReason,
      target: dto.target,
      timestamp: new Date(),
      isBan: true,
    });

    if (project.universeId && project.openCloud) {
      const opencloud = new OpenCloud(project.openCloud);
      await opencloud.restrictUser(
        project.universeId,
        dto.target,
        dto.publicReason,
        dto.privateReason,
      );
    }
  }
  async unbanTarget(projectId: string, target: number) {
    const project = await this.projectService.getProject(projectId);

    await this.banModel.create({
      project: mongoose.Types.ObjectId.createFromHexString(projectId),
      isBan: false,
      target: target,
    });

    if (project.universeId && project.openCloud) {
      const opencloud = new OpenCloud(project.openCloud);
      await opencloud.unrestrictUser(project.universeId, target);
    }
  }
}
