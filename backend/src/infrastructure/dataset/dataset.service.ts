import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class DatasetService {
  getDataset() {
    const raw = fs.readFileSync('data/tickets.json', 'utf8');

    return JSON.parse(raw);
  }
}
