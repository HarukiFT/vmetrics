import { Body, Controller, Get, Post, Query, Req, Request, UseGuards } from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto';
import { LogsService } from './logs.service';
import { ApiGuard } from '../projects/guards/api.guard';
import { CreateLogsDto } from './dto/create-logs.dto';
import { Filter } from './classes/filter.class';
import { ProjectGuard } from '../projects/guards/project.guard';
import { AuthGuard } from '../auth/guards/auth.guard';

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

    @Get('/actions')
    @UseGuards(AuthGuard, ProjectGuard)
    async getActions(@Request() request) {
        const projectId = request.projectId

        return await this.logsService.getActions(projectId)
    }

    @Get('/get')
    @UseGuards(AuthGuard, ProjectGuard)
    async getLogs(@Request() request, @Query('filter') filterString: string, @Query('limit') limit: string, @Query('page') page: string) {
        console.log(filterString)
        const projectId: string = request.projectId
        const limitNumber = parseInt(limit)
        const pageNumber = parseInt(page)
        const filter = await new Filter(filterString || '').toQuery()

        return await this.logsService.getLogs(projectId, filter, limitNumber, pageNumber)
    }

    @Get('/count')
    @UseGuards(AuthGuard, ProjectGuard)
    async countLogs(@Request() request, @Query('filter') filterString: string) {
        const projectId: string = request.projectId
        const filter = await new Filter(filterString || '').toQuery()

        return await this.logsService.countLogs(projectId, filter)
    }

    @Get('/fields')
    @UseGuards(AuthGuard, ProjectGuard)
    async getFields(@Request() request, @Query('filter') filterString: string) {
        const projectId: string = request.projectId
        const filter = await new Filter(filterString || '').toQuery()

        return await this.logsService.getLogsFields(projectId, filter)
    }
}