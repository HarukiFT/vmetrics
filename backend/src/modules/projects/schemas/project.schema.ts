import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { User } from "src/modules/users/schemas/user.schema";

@Schema()
export class Project {
    @Prop({type: String, required: true})
    name: string

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true})
    owner: mongoose.Types.ObjectId | User

    @Prop({type: String, required: true})
    apiKey: string

    @Prop({type: Date, required: true})
    timestamp: Date
}

export type ProjectDocument = Project & Document
export const ProjectSchema = SchemaFactory.createForClass(Project) 