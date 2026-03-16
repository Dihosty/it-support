import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logFilePath: string;
  private context: string = 'Application';

  constructor() {
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    this.logFilePath = path.join(logsDir, 'application.log');
    this.writeLog('info', 'Logger service initialized', 'LoggerService');
  }

  private writeLog(level: string, message: string, context?: string) {
    const timestamp = new Date()
      .toISOString()
      .replace('T', ' ')
      .substring(0, 19);
    const contextStr = context ? `[${context}]` : '';
    const logLine = `${timestamp} ${level} ${contextStr} ${message}\n`;

    console.log(logLine.trim());
    fs.appendFileSync(this.logFilePath, logLine);
  }

  setContext(context: string) {
    this.context = context;
  }

  log(message: string, context?: string) {
    this.writeLog('info', message, context || this.context);
  }

  error(message: string, trace?: string, context?: string) {
    const msg = trace ? `${message}\n${trace}` : message;
    this.writeLog('error', msg, context || this.context);
  }

  warn(message: string, context?: string) {
    this.writeLog('warn', message, context || this.context);
  }

  debug?(message: string, context?: string) {
    this.writeLog('debug', message, context || this.context);
  }

  verbose?(message: string, context?: string) {
    this.writeLog('verbose', message, context || this.context);
  }

  fatal?(message: string, trace?: string, context?: string) {
    const msg = trace ? `${message}\n${trace}` : message;
    this.writeLog('fatal', msg, context || this.context);
  }

  logTraining(message: string, data?: any) {
    const logMessage = data
      ? `${message} | Data: ${JSON.stringify(data)}`
      : message;
    this.writeLog('info', logMessage, 'Training');
  }

  logClassification(text: string, category: string, confidence?: number) {
    const confidenceStr = confidence
      ? ` (confidence: ${confidence.toFixed(2)})`
      : '';
    const shortText = text.length > 50 ? text.substring(0, 50) + '...' : text;
    this.writeLog(
      'info',
      `Classified "${shortText}" -> ${category}${confidenceStr}`,
      'Classification',
    );
  }

  logRequest(method: string, url: string, statusCode?: number) {
    const status = statusCode ? ` [${statusCode}]` : '';
    this.writeLog('info', `${method} ${url}${status}`, 'HTTP');
  }
}
