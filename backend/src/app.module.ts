import { Module } from '@nestjs/common';
import { TrainModelService, ClassifyTicketService } from './application';
import { DatasetService, ClassifierService } from './infrastructure';
import { ClassifierController } from './presentation';

const CONTROLLERS = [ClassifierController];
const SERVICES = [
  DatasetService,
  ClassifierService,
  TrainModelService,
  ClassifyTicketService,
];

@Module({
  controllers: [...CONTROLLERS],
  providers: [...SERVICES],
})
export class AppModule {}
