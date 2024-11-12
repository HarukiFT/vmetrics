import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { FeedbackSchema } from './schemas/feedback.schema';
import { Feedback } from './schemas/feedback.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [FeedbackController],
  providers: [FeedbackService],
  imports: [
    MongooseModule.forFeature([{ name: 'Feedback', schema: FeedbackSchema }]),
    ConfigModule,
  ],
})
export class FeedbackModule {}
