import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { SamplePort } from 'src/domain';

@Injectable()
export class DatasetService {
  getDataset(): SamplePort[] {
    const raw = fs.readFileSync('data/tickets.json', 'utf8');
    const normalized = raw.replace(/^\uFEFF/, '');

    return JSON.parse(normalized) as SamplePort[];
  }
}
