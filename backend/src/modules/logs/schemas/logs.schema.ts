import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Project } from "src/modules/projects/schemas/project.schema";

@Schema({strict: false})
export class Log {
    @Prop({type: String, required: true})
    action: string

    @Prop({type: Number, required: true})
    sender: number

    @Prop({type: Date, required: true})
    timestamp: Date

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true})
    project: Project | mongoose.Types.ObjectId

    [key: string]: any
}

export type LogDocument = Log & Document
export const LogSchema = SchemaFactory.createForClass(Log)
LogSchema.index({ project: 1, action: 1, sender: 1, timestamp: 1 });