import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Project } from "src/modules/projects/schemas/project.schema";

@Schema()
export class Format {
    @Prop({type: String, required: true})
    action: string

    @Prop({type: String, required: true})
    format: string

    @Prop({ type: mongoose.Schema.Types.Map, of: mongoose.Schema.Types.Mixed })
    formatTable: Map<number, Map<string, string>>;

    @Prop({type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Project'})
    project: mongoose.Types.ObjectId | Project

    @Prop({type: Date, required: true})
    timestamp: Date
}

export type FormatDocument = Format & Document
export const FormatSchema = SchemaFactory.createForClass(Format)

FormatSchema.index({project: 1})
FormatSchema.index({action: 1})