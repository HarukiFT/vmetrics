import { IsDate, IsDateString, IsNumber, IsString } from "class-validator";

export class CreateLogDto {
    @IsString()
    action: string

    @IsNumber()
    sender: number

    @IsDateString()
    timestamp: string

    [key: string]: any
}