import { Inject, Injectable } from '@nestjs/common';
import { CreateFormatDto } from './dto/create-format.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Format, FormatDocument } from './schemas/format.schema';
import mongoose, { Model } from 'mongoose';
import axios from 'axios';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

const ignoreFields = [
    'action',
    'project',
    '__v',
    '_id',
    'timestamp',
    '_doc',
    '$__',
    '$isNew'
]

const formatRegex = /@(\w+)\/(\w+)/g;
const formatsFn = {
    player: async (value: number | undefined, cacheService: Cache) => {
        if (!value) {
            return 'пусто'
        }

        if (value === 0) {
            return 'сервер'
        }

        try {
            const existUsername = await cacheService.get<string>(value.toString())
            if (existUsername) {
                return existUsername
            }

            const result = await axios.get(`https://users.roblox.com/v1/users/${value}`)

            await cacheService.set(value.toString(), result.data.name, 1000 * 60 * 15)
            return (result.data.name)
        } catch (err) {
            return 'пусто'
        }
    },

    string: (value: number | string | undefined) => {
        if (!value) {
            return 'пусто'
        }
        return `${value}`
    }
}

@Injectable()
export class FormatsService {
    constructor(@InjectModel('Format') private formatModel: Model<Format>, @Inject(CACHE_MANAGER) private cacheService: Cache){}

    async getFormatLog(projectId: string, action: string, payload: Record<string, any>) {
        const projectOID = mongoose.Types.ObjectId.createFromHexString(projectId)

        const formatDocument = await this.cacheService.get(`${projectOID.toString()}-${action}`) as FormatDocument ?? await this.formatModel.findOne({
            project: projectOID,
            action: action
        })

        if (!(await this.cacheService.get(`${projectOID.toString()}-${action}`))) {
            await this.cacheService.set(`${projectOID.toString()}-${action}`, formatDocument, 1000 * 60 * 15)
        }

        if (!formatDocument) {
            let resultString = `Нет формат строки для {0} / `
            const keys = Object.keys(payload._doc).filter((value) => !ignoreFields.find((field) => field === value))
            const params = [['@action', action]]

            for (let i = 0; i < keys.length; i++) {
                resultString += `{${params.length}}=`
                params.push(['@field', keys[i]])
                resultString += `{${params.length}}; `

                if (keys[i] == 'sender') {
                    params.push(['@player', await formatsFn['player'](payload[keys[i]], this.cacheService)])
                } else {
                    params.push(['@placeholder', payload[keys[i]]])
                }
            }

            return {
                string: resultString,
                params: params
            }
        }

        const matches = formatDocument.format.match(formatRegex);
        if (matches) {
            const resultString = formatDocument.format.replace(formatRegex, (match, key, value) => {
                const index = matches.indexOf(match);
                return `{${index}}`;
            }); 

            const resultArray = matches.map(match => match.split('/'));
            for (let pair of resultArray) {
                const key = pair[0].substring(1)
                const value = payload[pair[1]]

                if (key && key in formatsFn) {
                    pair[1] = await formatsFn[key](value, this.cacheService)
                } else {
                    pair[1] = `${value ?? ''}`
                }
            }

            console.log(resultString, resultArray)

            return {
                string: resultString,
                params: resultArray
            }
        }

        return {
            string: formatDocument.format,
            params: []
        }
    }

    async fetchFormats(projectId: string) {
        const projectOID = mongoose.Types.ObjectId.createFromHexString(projectId)

        return await this.formatModel.find({
            project: projectOID
        }).sort({
            action: 1
        })
    }

    async createFormat(projectId: string, createFormatDto: CreateFormatDto) {
        const projectOID = mongoose.Types.ObjectId.createFromHexString(projectId)

        await this.formatModel.findOneAndDelete({
            project: projectOID,
            action: createFormatDto.action
        }).exec()

        await this.cacheService.del(`${projectOID.toString()}-${createFormatDto.action}`)

        return await new this.formatModel({
            format: createFormatDto.format,
            action: createFormatDto.action,
            formatTable: createFormatDto.formatTable ?? {},
            project: projectOID,
            timestamp: new Date()
        }).save()
    }
}
