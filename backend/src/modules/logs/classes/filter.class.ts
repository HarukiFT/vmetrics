import axios from "axios"
import { IsNumberString } from "class-validator"

const formatRegexp = /@(\w+)\/(.+)/;
const formatters = {
    date: (value: string) => {
        return new Date(value)
    },

    player: async (value: string) => {
        try {
            const result = await axios.post('https://users.roblox.com/v1/usernames/users', {
                usernames: [
                    value
                ]
            })

            if (result.data.data.length === 0) { return -1 }
            return (result.data.data[0].id)
        } catch {
            return -1
        }
    }
}

const compares = {
    '=': '$eq',
    '>': '$gt',
    '<': '$lt'
}

export class Filter {
    constructor(private filterString: string) {}

    async parseValue(value: string) {
        if (isNaN(parseFloat(value))) {

            const match = formatRegexp.exec(value)
            if (match === null || match.length < 3) {
                return value
            }

            const formatType = match[1]
            const valueToFormat = match[2]

            if (formatters[formatType]) {
                return await formatters[formatType](valueToFormat)
            }
            
            return valueToFormat
        } else {
            return parseFloat(value)
        }
    }

    async toQuery() {
        const splitted = this.filterString.split(',')
        const query = {}
        for (let filterUnit of splitted) {
            let operation = ''
            let pair
            for (let op of Object.keys(compares)) {
                pair = filterUnit.split(op).filter((value) => value !== '')
                operation = compares[op]
                if (pair.length == 2) break;
            }

            const key = pair[0]
            const value = pair[1]

            const formattedValue = await this.parseValue(value)

            if (key === undefined || formattedValue === undefined) continue;

            query[key] = {[operation]: formattedValue}
       }

       return query
    }
}