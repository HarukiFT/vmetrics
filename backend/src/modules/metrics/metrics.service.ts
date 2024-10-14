import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { MetricDocument } from './schemas/metric.schema';
import { CreateMetricDto } from './dto/create-metric.dto';
import { ProjectDocument } from '../projects/schemas/project.schema';
import axios from 'axios';

const infoEndpoint = 'https://games.roblox.com/v1/games?universeIds=';

@Injectable()
export class MetricsService {
  constructor(
    @InjectModel('Metric') private readonly metricsModel: Model<MetricDocument>,
    @InjectModel('Project')
    private readonly projectsModel: Model<ProjectDocument>,
  ) {}

  async getPortals() {
    const projects = await this.projectsModel.find();

    const output = {};

    for (const project of projects) {
      const data = await this.metricsModel.aggregate([
        {
          $match: {
            project: mongoose.Types.ObjectId.createFromHexString(project.id),
            value: 'redirect',
          },
        },
        {
          $group: {
            _id: '$metadata.clarification.from',
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]);

      if (data.length === 0) {
        continue;
      }

      const places: Record<string, any>[] = await axios
        .get(`${infoEndpoint}${data.map((part) => part._id).join(',')}`)
        .then((response) => response.data.data);

      output[project.name] = data.map((redirects) => ({
        name: places.find((place) => place.id === redirects._id)?.name,
        redirects: redirects.count,
      }));
    }

    return output;
  }

  async createMetric(
    projectId: string,
    createMetricDto: CreateMetricDto,
  ): Promise<undefined> {
    const projectOID = mongoose.Types.ObjectId.createFromHexString(projectId);

    const timestampDate = new Date(createMetricDto.timestamp);

    await new this.metricsModel({
      timestamp: timestampDate,
      value: createMetricDto.value,
      project: projectOID,
      metadata: createMetricDto.clarification
        ? { clarification: createMetricDto.clarification }
        : undefined,
    }).save();
  }
}
