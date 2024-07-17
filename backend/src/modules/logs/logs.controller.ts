import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto';
import { LogsService } from './logs.service';
import { ApiGuard } from '../projects/guards/api.guard';
import { CreateLogsDto } from './dto/create-logs.dto';

@Controller('logs')
export class LogsController {
    constructor(private readonly logsService: LogsService) {}

    @Post('/create')
    @UseGuards(ApiGuard)
    async createLog(@Body() createLogDto: CreateLogDto, @Request() request: any): Promise<undefined> {
        await this.logsService.createLog(request.projectId, createLogDto)
    }

    @Post('/mcreate')
    @UseGuards(ApiGuard)
    async createLogs(@Body() createLogsDtoArray: CreateLogsDto, @Request() request: any): Promise<undefined> {
        for (let dto of createLogsDtoArray.payload) {
            await this.logsService.createLog(request.projectId, dto)
        }
    }
}