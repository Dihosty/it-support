import { Controller, Post, Body, Get } from '@nestjs/common';
import { TrainModelService, ClassifyTicketService } from 'src/application';

@Controller()
export class ClassifierController {
  constructor(
    private trainService: TrainModelService,
    private classifyService: ClassifyTicketService,
  ) {}

  @Post('train')
  train() {
    return this.trainService.train();
  }

  @Post('classify')
  classify(@Body() body: { text: string }) {
    return this.classifyService.classify(body.text);
  }

  @Get('health')
  health() {
    return { status: 'ok' };
  }
}
