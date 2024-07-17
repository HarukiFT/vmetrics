import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { ProjectsService } from "../projects.service";
import { ProjectDocument } from "../schemas/project.schema";
import mongoose from "mongoose";
import { UserData } from "src/modules/auth/interfaces/user-data.interface";

@Injectable()
export class ProjectGuard implements CanActivate {
    constructor(private projectsService: ProjectsService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const userPayload: UserData = request.user 
        const projectId: string = request.headers['project-id'] ?? ''

        try {
            const projectDocument: ProjectDocument | null = await this.projectsService.getProject(projectId)
            if (!projectDocument) {
                throw new ForbiddenException()
            }

            if ((<mongoose.Types.ObjectId>projectDocument.owner).toString() !== userPayload._id) {
                throw new ForbiddenException()
            }
        } catch(err) {
            return false
        }

        request.projectId = projectId
        return true
    }
}