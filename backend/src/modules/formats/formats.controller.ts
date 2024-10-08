import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { FormatsService } from './formats.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ProjectGuard } from '../projects/guards/project.guard';
import { CreateFormatDto } from './dto/create-format.dto';
import { RemoveFormatDto } from './dto/remove-format.dto';

@Controller('formats')
export class FormatsController {
    constructor(private readonly formatsService: FormatsService) {}

    @Post('/create')
    @UseGuards(AuthGuard, ProjectGuard)
    async createFormat(@Request() request, @Body() createFormatDto: CreateFormatDto) {
        const projectId = request.projectId

        await this.formatsService.createFormat(projectId, createFormatDto)
    }

    @Post('/remove')
    @UseGuards(AuthGuard, ProjectGuard)
    async removeFormat(@Request() request, @Body() removeFormatDto: RemoveFormatDto) {
        const projectId = request.projectId
        
        await this.formatsService.removeFormat(projectId, removeFormatDto)
    }
    
    @Get('/fetch')
    @UseGuards(AuthGuard, ProjectGuard)
    async getFormat(@Request() request) {
        const projectId = request.projectId

        return await this.formatsService.fetchFormats(projectId)
    }
}
