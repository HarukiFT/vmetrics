import { IsNumber, IsString } from 'class-validator';

export class BanRecordDto {
  @IsNumber()
  target: number;

  @IsString()
  publicReason: string;

  @IsString()
  privateReason: string;
}
