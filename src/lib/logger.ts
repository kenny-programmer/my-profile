/**
 * Structured logger
 */
type LogLevel = 'debug' | 'info' | 'warn' | 'error'

function log(level: LogLevel, ...args: unknown[]): void {
  if (process.env.NODE_ENV === 'production' && level === 'debug') return
  const prefix = `[${new Date().toISOString()}] [${level.toUpperCase()}]`
  switch (level) {
    case 'debug': console.debug(prefix, ...args); break
    case 'info':  console.info(prefix, ...args);  break
    case 'warn':  console.warn(prefix, ...args);  break
    case 'error': console.error(prefix, ...args); break
  }
}

export const logger = {
  debug: (...args: unknown[]) => log('debug', ...args),
  info:  (...args: unknown[]) => log('info',  ...args),
  warn:  (...args: unknown[]) => log('warn',  ...args),
  error: (...args: unknown[]) => log('error', ...args),
}
