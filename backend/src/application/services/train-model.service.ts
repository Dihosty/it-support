import { Injectable } from '@nestjs/common';
import {
  DatasetService,
  ClassifierService,
  LoggerService,
} from 'src/infrastructure';

@Injectable()
export class TrainModelService {
  constructor(
    private dataset: DatasetService,
    private classifier: ClassifierService,
    private logger: LoggerService,
  ) {}

  private shuffle<T>(arr: T[]): T[] {
    return [...arr]
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  private splitDataset(
    data: any[],
    trainRatio: number = 0.85,
  ): { train: any[]; test: any[] } {
    const categoryGroups = new Map<string, any[]>();
    data.forEach((sample) => {
      if (!categoryGroups.has(sample.category)) {
        categoryGroups.set(sample.category, []);
      }
      categoryGroups.get(sample.category)!.push(sample);
    });

    const train: any[] = [];
    const test: any[] = [];

    categoryGroups.forEach((samples) => {
      const shuffled = this.shuffle(samples);

      const trainSize = Math.floor(shuffled.length * trainRatio);
      train.push(...shuffled.slice(0, trainSize));
      test.push(...shuffled.slice(trainSize));
    });

    return {
      train: this.shuffle(train),
      test: this.shuffle(test),
    };
  }

  train() {
    const startTime = Date.now();
    this.logger.log('Starting model training...', 'TrainModelService');

    try {
      const data = this.dataset.getDataset();
      this.logger.logTraining(`Loaded dataset with ${data.length} samples`);

      // Розділення на train/test
      const { train, test } = this.splitDataset(data, 0.85);
      this.logger.logTraining(
        `Split dataset: ${train.length} training, ${test.length} testing`,
      );

      // Навчання
      this.logger.log('Training classifier...', 'TrainModelService');
      const trainResult = this.classifier.train(train);
      this.logger.logTraining('Training completed', trainResult);

      // Оцінка точності на тестовій вибірці
      this.logger.log('Evaluating model...', 'TrainModelService');
      const evaluation = this.classifier.evaluate(test);

      this.logger.logTraining('Model evaluation results', {
        accuracy: `${(evaluation.accuracy * 100).toFixed(2)}%`,
        correct: evaluation.details.correct,
        incorrect: evaluation.details.incorrect,
        total: evaluation.details.total,
      });

      // Логування точності по категоріях
      Object.keys(evaluation.details.perCategory).forEach((category) => {
        const stats = evaluation.details.perCategory[category];
        this.logger.logTraining(
          `Category "${category}" accuracy: ${(stats.accuracy * 100).toFixed(2)}% (${stats.correct}/${stats.total})`,
        );
      });

      // Після оцінки донавчаємо модель на всьому датасеті
      this.classifier.train(data);
      this.logger.logTraining(
        `Final model retrained on full dataset: ${data.length} samples`,
      );

      const duration = Date.now() - startTime;
      this.logger.logTraining(`Model training completed in ${duration}ms`);

      return {
        success: true,
        training: {
          samples: train.length,
          vocabularySize: trainResult.vocabularySize,
          categories: trainResult.categories,
        },
        evaluation: {
          testSamples: test.length,
          accuracy: evaluation.accuracy,
          accuracyPercent: `${(evaluation.accuracy * 100).toFixed(2)}%`,
          details: evaluation.details,
        },
        duration: `${duration}ms`,
      };
    } catch (error) {
      this.logger.error(
        `Training failed: ${error.message}`,
        error.stack,
        'TrainModelService',
      );
      throw error;
    }
  }
}
