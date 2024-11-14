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
        content: `Ты получаешь на вход отзыв игрока об игре в роблоксе. Твоя задача как нейросети - понять, обратная связь связана как либо с игрой, или это его эмоции, или игрок просто решил потроллить с матом и оскорблениям жесткими. Но не стоит на каждый запрос кидать false! Мне важно мнение игрока!. Под троллингом воспринимается просто какая-та белеберда, которая вообще никак не относится к игре, в ином случае это отзыв который разработчики должны увидеть. Твоя задача ответ ответ в следужющем форме:
          {
            "passed": true | false (true если это что-то более менее, false только если это троллинг с матами и прочим, false очень редко должно быть, только в самых крайних случаях),
          }

          Ответь на отзыв: ${feedback.text} (обязательно верни JSON, не выдумывая свои выходные данные). Только JSON и ничего более, я это паршу.
          `,
      })
      .then((response) => {
        return response.data.choices[0].message.content;
      });

    console.log(response);

    const mapped = JSON.parse(response) as {
      passed: boolean;
    };

    if (!mapped.passed) {
      return;
    }

    return this.feedbackModel.create({
      sender: feedback.sender,
      text: feedback.text,
      rating: feedback.rating,
      type: feedback.type,
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

  async getFeedbackCountsByType(startDate?: Date, endDate?: Date) {
    const query: any = {};

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) {
        query.timestamp.$gte = startDate;
      }
      if (endDate) {
        query.timestamp.$lte = endDate;
      }
    }

    console.log(query);

    const feedbackCounts = await this.feedbackModel.aggregate([
      {
        $match: query,
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          type: '$_id',
          count: 1,
        },
      },
    ]);

    return feedbackCounts;
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
