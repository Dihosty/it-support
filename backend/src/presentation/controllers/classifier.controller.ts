import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { TrainModelService, ClassifyTicketService } from 'src/application';
import { LoggerService } from 'src/infrastructure';

@Controller()
export class ClassifierController {
  constructor(
    private trainService: TrainModelService,
    private classifyService: ClassifyTicketService,
    private logger: LoggerService,
  ) {}

  @Post('train')
  train() {
    this.logger.logRequest('POST', '/train');
    try {
      const result = this.trainService.train();
      this.logger.logRequest('POST', '/train', 200);
      return result;
    } catch (error) {
      this.logger.logRequest('POST', '/train', 500);
      this.logger.error(
        `Train endpoint error: ${error.message}`,
        error.stack,
        'ClassifierController',
      );
      throw error;
    }
  }

  @Post('classify')
  classify(@Body() body: { text: string }) {
    this.logger.logRequest('POST', '/classify');
    if (
      !body ||
      typeof body.text !== 'string' ||
      body.text.trim().length === 0
    ) {
      this.logger.logRequest('POST', '/classify', 400);
      throw new BadRequestException('text must be a non-empty string');
    }

    try {
      const result = this.classifyService.classify(body.text.trim());
      this.logger.logRequest('POST', '/classify', 200);
      return result;
    } catch (error) {
      this.logger.logRequest('POST', '/classify', 500);
      this.logger.error(
        `Classify endpoint error: ${error.message}`,
        error.stack,
        'ClassifierController',
      );
      throw error;
    }
  }

  @Get('health')
  health() {
    this.logger.logRequest('GET', '/health', 200);

    return {
      status: 'ok',
    };
  }
}
