import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Project } from "src/modules/projects/schemas/project.schema";

@Schema({
    timeseries: {
      timeField: 'timestamp',
      metaField: 'metadata',
      granularity: 'seconds'
    },
})
export class Metric{
    @Prop({ required: true })
    timestamp: Date

    @Prop({type: Object})
    metadata?: {
        clarification: any
    }

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true })
    project: mongoose.Types.ObjectId | Project

    @Prop({ required: true })
    value: string
}

export type MetricDocument = Metric & Document

export const MetricSchema = SchemaFactory.createForClass(Metric)
MetricSchema.index({ project: 1, value: 1, timestamp: 1, 'metadata.clarification': 1});