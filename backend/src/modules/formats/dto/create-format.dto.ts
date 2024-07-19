import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

interface FormatTableValue {
    [key: string]: string;
}

export class CreateFormatDto {
    @IsString()
    action: string;

    @IsString()
    format: string;

    @ValidateNested({ each: true })
    @Type(() => Map)
    formatTable: Map<string, FormatTableValue>;
}
