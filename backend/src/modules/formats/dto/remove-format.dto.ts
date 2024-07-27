import { IsString } from 'class-validator';

export class RemoveFormatDto {
    @IsString()
    id: string
}
