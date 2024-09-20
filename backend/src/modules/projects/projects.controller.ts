import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectGuard } from './guards/project.guard';
import { ApiGuard } from './guards/api.guard';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post('/create')
  @UseGuards(AuthGuard)
  async createProject(
    @Request() request: any,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    await this.projectsService.createProject(request.user, createProjectDto);
  }

  @Post('/opencloud')
  @UseGuards(AuthGuard, ProjectGuard)
  async setOpenCloud(@Request() request: any, @Body('token') token: string) {
    await this.projectsService.setOpenCloud(request.projectId, token);
  }

  @Get('/get')
  @UseGuards(AuthGuard, ProjectGuard)
  async getProject(@Request() request: any) {
    const projectId = request.projectId;

    return await this.projectsService.getProject(projectId);
  }

  @Get('/debug')
  async debug(@Request() request: any) {
    return request.headers;
  }

  @Get('/isvalid')
  @UseGuards(ApiGuard)
  async isValid() {}

  @Get('/fetch')
  @UseGuards(AuthGuard)
  async fetchProjects(@Request() request: any) {
    return await this.projectsService.fetchProjects(request.user);
  }
}
