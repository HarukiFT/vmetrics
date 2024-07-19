import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { FormatsService } from './formats.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ProjectGuard } from '../projects/guards/project.guard';
import { CreateFormatDto } from './dto/create-format.dto';

@Controller('formats')
export class FormatsController {
    constructor(private readonly formatsService: FormatsService) {}

    @Post('/create')
    @UseGuards(AuthGuard, ProjectGuard)
    createFormat(@Request() request, @Body() createFormatDto: CreateFormatDto) {
        
    }
}
