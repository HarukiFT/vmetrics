import { IsNumber, IsString } from 'class-validator';

export class CreateFeedbackDto {
  @IsNumber()
  sender: number;

  @IsString()
  text: string;

  @IsNumber()
  rating: number;
}
