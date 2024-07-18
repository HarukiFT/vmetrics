import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ProjectsService } from "../projects.service";
import { ProjectDocument } from "../schemas/project.schema";
import mongoose from "mongoose";

@Injectable()
export class ApiGuard implements CanActivate {
    constructor(private readonly projectService: ProjectsService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()

        const apiKey = request.headers['api-key'] ?? ''
        const projectDocument : ProjectDocument | null = await this.projectService.getProjectByApi(apiKey)
        if (!projectDocument) {
            return false
        }

        request.projectId = (<mongoose.Types.ObjectId>projectDocument.id).toString()

        return true
    }
}