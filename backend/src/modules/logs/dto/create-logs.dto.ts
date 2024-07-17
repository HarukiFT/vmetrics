import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { CreateLogDto } from "./create-log.dto";

export class CreateLogsDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateLogDto)
    payload: CreateLogDto[];
}