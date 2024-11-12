import { Body, Controller, Get, Post } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post('/create')
  async create(@Body() feedback: CreateFeedbackDto) {
    return this.feedbackService.createFeedback(feedback);
  }

  @Post('/get')
  async getFeedback(
    @Body()
    params: {
      page?: number;
      limit?: number;
      filters?: {
        type?: string;
        rating?: number;
        startDate?: Date;
        endDate?: Date;
      };
    },
  ) {
    return this.feedbackService.getFeedback(
      params.page,
      params.limit,
      params.filters,
    );
  }

  @Get('/counts')
  async getFeedbackCountsByDay() {
    return this.feedbackService.getFeedbackCountsByDay();
  }
}
