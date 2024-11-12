import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { FeedbackDocument } from './schemas/feedback.schema';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

const aiEndpoint =
  'https://script.google.com/macros/s/AKfycbyh6vblATOgD9dVKEaUxUa3umpDvr6dVbP1sM-yko2WJRe68qHyeZFM5a7DEFbXBrPJ/exec';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel('Feedback')
    private readonly feedbackModel: Model<FeedbackDocument>,
    private readonly configService: ConfigService,
  ) {}

  async createFeedback(feedback: CreateFeedbackDto) {
    const response = await axios
      .post(aiEndpoint, {
        content: `Ты получаешь на вход отзыв игрока об игре. Твоя задача ответ ответ в следужющем форме (полностью на русском языке):
          {
            "summary": "краткое содержание отзыва",
            "rating": "если это возможно, выведи оценку игры от 1 до 5",
            "type": "благодарность, жалоба, баг, предложение, вопрос, троллинг (одно слово)"
          }

          Ответь на отзыв: ${feedback.text} (обязательно верни JSON, даже если это белеберда просто поставь тип троллинг, не выдумывай свои типы). Повторюсь, используй только русский
          `,
      })
      .then((response) => {
        return response.data.choices[0].message.content;
      });

    console.log(response);
    const mapped = JSON.parse(response) as {
      summary: string;
      rating: string | null;
      type: string;
    };

    return this.feedbackModel.create({
      sender: feedback.sender,
      text: feedback.text,
      summary: mapped.summary,
      rating: feedback.rating,
      type: mapped.type,
      timestamp: new Date(),
    });
  }

  async getFeedback(
    page: number = 1,
    limit: number = 10,
    filters?: {
      type?: string;
      rating?: number;
      startDate?: Date;
      endDate?: Date;
    },
  ) {
    const skip = (page - 1) * limit;

    // Build filter query
    const query: any = {};

    if (filters) {
      if (filters.type) {
        query.type = filters.type;
      }
      if (filters.rating) {
        query.rating = filters.rating;
      }
      if (filters.startDate || filters.endDate) {
        query.timestamp = {};
        if (filters.startDate) {
          query.timestamp.$gte = filters.startDate;
        }
        if (filters.endDate) {
          query.timestamp.$lte = filters.endDate;
        }
      }
    }

    // Get total count for pagination
    const total = await this.feedbackModel.countDocuments(query);

    // Get paginated and filtered results
    const feedback = await this.feedbackModel
      .find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      data: feedback,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getFeedbackCountsByDay() {
    const feedbackCounts = await this.feedbackModel.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          count: 1,
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);

    return feedbackCounts;
  }
}
