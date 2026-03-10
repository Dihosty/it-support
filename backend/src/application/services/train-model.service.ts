import { Injectable } from '@nestjs/common';
import { DatasetService, ClassifierService } from 'src/infrastructure';

@Injectable()
export class TrainModelService {
  constructor(
    private dataset: DatasetService,
    private classifier: ClassifierService,
  ) {}

  train() {
    const data = this.dataset.getDataset();
    this.classifier.train(data);
    return { success: true, samples: data.length };
  }
}
