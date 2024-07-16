import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { getSalt, hash } from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

    async isUserExist(username: string) {
        const userDocument = await this.userModel.findOne({
            username
        }).exec()

        return (userDocument !== null)
    }

    async getUserByUsername(username: string) {
        const userDocument = await this.userModel.findOne({
            username
        }).exec()

        return userDocument
    }

    async getUserById(userId: string) {
        const userDocument = await this.userModel.findOne({
            _id: mongoose.Types.ObjectId.createFromHexString(userId)
        }).exec()

        return userDocument
    }

    async createUser(createUserDto: CreateUserDto) {
        const password = await hash(createUserDto.password, 10)

        return await new this.userModel({
            username: createUserDto.username,
            password
        }).save()
    }
}
