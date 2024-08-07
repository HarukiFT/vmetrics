import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Mongoose } from "mongoose";

@Schema()
export class User {
    @Prop({type: String, required: true})
    username: string

    @Prop({type: String, required: true})
    password: string
}


export type UserDocument = User & Document

export const UserSchema = SchemaFactory.createForClass(User)
UserSchema.index({username: 1})