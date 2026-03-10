export interface ClassifierPort {
  train(data: { text: string; category: string }[]): Promise<number>;
  classify(text: string): Promise<string>;
}
