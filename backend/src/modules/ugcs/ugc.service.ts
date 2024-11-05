import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UgcDocument } from './schemas/ugc.schema';

@Injectable()
export class UgcsService {
  constructor(@InjectModel('Ugc') private ugcModel: Model<UgcDocument>) {}

  async addUgc(name: string) {
    return this.ugcModel.create({
      name: name,
      votes: 0,
    });
  }

  async addVotes(name: string, amount: number) {
    return this.ugcModel.updateOne(
      {
        name: name,
      },
      {
        $inc: {
          votes: amount,
        },
      },
    );
  }

  async resetVotes(name: string) {
    return this.ugcModel.updateOne(
      {
        name: name,
      },
      {
        votes: 0,
      },
    );
  }

  async getUgc(name: string) {
    return this.ugcModel.findOne({
      name: name,
    });
  }
}
