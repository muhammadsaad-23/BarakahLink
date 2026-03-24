import { env } from '../config/env';

type Level = 'info' | 'warn' | 'error' | 'debug';

function timestamp() {
  return new Date().toISOString();
}

function log(level: Level, message: string, meta?: Record<string, unknown>) {
  const entry = JSON.stringify({ ts: timestamp(), level, message, ...meta });
  if (level === 'error') {
    console.error(entry);
  } else if (level === 'warn') {
    console.warn(entry);
  } else if (level === 'debug' && env.NODE_ENV !== 'production') {
    console.debug(entry);
  } else {
    console.log(entry);
  }
}

export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => log('info', message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => log('warn', message, meta),
  error: (message: string, meta?: Record<string, unknown>) => log('error', message, meta),
  debug: (message: string, meta?: Record<string, unknown>) => log('debug', message, meta),
};
