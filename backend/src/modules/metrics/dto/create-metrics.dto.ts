import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { CreateMetricDto } from "./create-metric.dto";

export class CreateMetricsDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateMetricDto)
    payload: CreateMetricDto[];
}