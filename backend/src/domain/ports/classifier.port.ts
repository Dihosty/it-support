import { ClassifyResultPort } from './classify-result.port';
import { SamplePort } from './sample.port';
import { TestResultPort } from './test-result.port';
import { TrainResultPort } from './train-result.port';

export interface ClassifierPort {
  train(data: SamplePort[]): TrainResultPort;
  classify(text: string): string;
  classifyWithConfidence(text: string): ClassifyResultPort;
  evaluate(data: SamplePort[]): TestResultPort;
  isTrained(): boolean;
}
