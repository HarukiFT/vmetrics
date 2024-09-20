import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BanDocument } from './schemas/bans.schema';
import mongoose, { Model } from 'mongoose';
import { BanRecordDto } from './dto/ban-record.dto';

@Injectable()
export class BansService {
  constructor(@InjectModel('Ban') private banModel: Model<BanDocument>) {}

  async banTarget(projectId: string, dto: BanRecordDto) {
    await this.banModel.create({
      publicReason: dto.publicReason,
      project: mongoose.Types.ObjectId.createFromHexString(projectId),
      privateReason: dto.privateReason,
      target: dto.target,
      timestamp: new Date(),
      isBan: true,
    });
  }

  async unbanTarget(projectId: string, target: number) {
    await this.banModel.create({
      project: mongoose.Types.ObjectId.createFromHexString(projectId),
      isBan: false,
      target: target,
    });
  }
}
