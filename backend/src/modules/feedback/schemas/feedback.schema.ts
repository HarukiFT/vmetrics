import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Feedback {
  @Prop({ type: Number, required: true })
  sender: number;

  @Prop({ type: String, required: true })
  text: string;

  @Prop({ type: String, required: true })
  type: string;

  @Prop({ type: Number })
  rating?: number;

  @Prop({ type: String, required: true })
  summary: string;

  @Prop({ type: Date, required: true })
  timestamp: Date;
}

export type FeedbackDocument = Feedback & Document;
export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
FeedbackSchema.index({ timestamp: -1, type: 1 });
