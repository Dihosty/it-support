import { Injectable } from '@nestjs/common';
import { ClassifierService, LoggerService } from 'src/infrastructure';

@Injectable()
export class ClassifyTicketService {
  constructor(
    private classifier: ClassifierService,
    private logger: LoggerService,
  ) {}

  classify(text: string) {
    try {
      if (!this.classifier.isTrained()) {
        return {
          error: true,
          message: 'Модель не навчена',
          category: null,
          text,
        };
      }

      const category = this.classifier.classify(text);
      this.logger.logClassification(text, category);
      return { category, text };
    } catch (error) {
      console.error('Classification error:', error);
      this.logger.error(
        `Classification failed: ${error.message}`,
        error.stack,
        'ClassifyTicketService',
      );
      throw error;
    }
  }
}
