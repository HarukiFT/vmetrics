import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UgcSchema } from './schemas/ugc.schema';
import { UgcsService } from './ugc.service';
import { UgcController } from './ugc.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Ugc',
        schema: UgcSchema,
      },
    ]),
  ],
  controllers: [UgcController],
  providers: [UgcsService],
})
export class UgcsModule {}
