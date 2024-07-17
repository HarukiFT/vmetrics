import { IsDate, IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateLogDto {
    @IsString()
    action: string

    @IsNumber()
    sender: number

    @IsOptional()
    @IsDateString()
    timestamp?: string

    [key: string]: any
}