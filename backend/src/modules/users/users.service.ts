import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

    async isUserExist(username: string) {
        const userDocument = await this.userModel.findOne({
            username: username
        }).exec()

        return (userDocument !== null)
    }

    async createUser(createUserDto: CreateUserDto) {
        return await new this.userModel(createUserDto).save()
    }
}
