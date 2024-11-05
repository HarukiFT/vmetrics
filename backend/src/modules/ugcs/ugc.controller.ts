import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UgcsService } from './ugc.service';

@Controller('/ugc')
export class UgcController {
  constructor(private readonly ugcService: UgcsService) {}

  @Post('/create')
  async createUgc(@Body('name') name: string) {
    return this.ugcService.addUgc(name);
  }

  @Post('/add')
  async addUgc(@Body('name') name: string, @Body('amount') amount: number) {
    return this.ugcService.addVotes(name, amount);
  }

  @Post('/reset')
  async resetVotes(@Body('name') name: string) {
    return this.ugcService.resetVotes(name);
  }

  @Get('/get')
  async getUgc(@Query('name') name: string) {
    return this.ugcService.getUgc(name);
  }
}
