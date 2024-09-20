import { Module } from '@nestjs/common';
import { BansController } from './bans.controller';
import { BansService } from './bans.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BanSchema } from './schemas/bans.schema';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Ban',
        schema: BanSchema,
      },
    ]),
    ProjectsModule,
  ],
  controllers: [BansController],
  providers: [BansService],
})
export class BansModule {}
