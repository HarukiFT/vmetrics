import { IsDateString, IsString } from "class-validator";

export class CreateMetricDto {
    @IsString()
    value: string

    @IsDateString()
    timestamp: string

    clarification: any
}