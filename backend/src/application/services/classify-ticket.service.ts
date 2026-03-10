import { Injectable } from '@nestjs/common';
import { ClassifierService } from 'src/infrastructure';

@Injectable()
export class ClassifyTicketService {
  constructor(private classifier: ClassifierService) {}

  classify(text: string) {
    const category = this.classifier.classify(text);
    return { category };
  }
}
