import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Ugc {
  @Prop({ type: String, unique: true })
  name: string;

  @Prop({ type: Number })
  votes: number;
}

export type UgcDocument = Ugc & Document;
export const UgcSchema = SchemaFactory.createForClass(Ugc);
UgcSchema.index({ name: 1 });
