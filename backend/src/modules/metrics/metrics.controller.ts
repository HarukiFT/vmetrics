import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { ApiGuard } from '../projects/guards/api.guard';
import { CreateMetricDto } from './dto/create-metric.dto';
import { CreateMetricsDto } from './dto/create-metrics.dto';

@Controller('metrics')
export class MetricsController {
    constructor(private readonly metricsService: MetricsService) {}

    @Post('/create')
    @UseGuards(ApiGuard)
    async createMetric(@Body() createMetricDto: CreateMetricDto, @Request() request: any) {
        await this.metricsService.createMetric(request.projectId, createMetricDto)
    }

    @Post('/mcreate')
    @UseGuards(ApiGuard)
    async createMetrics(@Body() createMetricsDto: CreateMetricsDto, @Request() request: any) {
        for (let dto of createMetricsDto.payload) {
            await this.metricsService.createMetric(request.projectId, dto)
        }
    }
}