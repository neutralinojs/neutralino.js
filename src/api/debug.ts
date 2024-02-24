import { sendMessage } from '../ws/websocket';

export enum LoggerType {
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  INFO = 'INFO',
}

export function log(message: string, type?: LoggerType): Promise<void> {
  return sendMessage('debug.log', { message, type });
}
