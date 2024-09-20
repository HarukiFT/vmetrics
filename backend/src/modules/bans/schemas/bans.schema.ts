import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Project } from 'src/modules/projects/schemas/project.schema';

@Schema()
export class Ban {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  })
  project: Project | mongoose.Types.ObjectId;

  @Prop({ type: Boolean, required: true })
  isBan: boolean;

  @Prop({ type: Number, required: true })
  target: number;

  @Prop({ type: String })
  publicReason?: string;

  @Prop({ type: String })
  privateReason?: string;

  @Prop({ type: Date, required: true })
  timestamp: Date;
}

export type BanDocument = Ban & Document;
export const BanSchema = SchemaFactory.createForClass(Ban);
BanSchema.index({ project: 1, target: 1, timestamp: -1 });
