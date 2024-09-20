import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiGuard } from '../projects/guards/api.guard';
import { BanRecordDto } from './dto/ban-record.dto';
import { BansService } from './bans.service';

@Controller('bans')
export class BansController {
  constructor(private bansService: BansService) {}

  @Post('/ban')
  @UseGuards(ApiGuard)
  async banTarget(@Request() request: any, @Body() dto: BanRecordDto) {
    await this.bansService.banTarget(request.projectId, dto);
  }

  @Post('/unban')
  @UseGuards(ApiGuard)
  async unbanTarget(@Request() requst: any, @Body('target') target: number) {
    await this.bansService.unbanTarget(requst.prjectId, target);
  }
}
