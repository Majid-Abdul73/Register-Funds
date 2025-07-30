import fs from 'fs';
import path from 'path';

class Logger {
  private logDir: string;

  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');
    this.ensureLogDirectory();
  }

  private ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
  }

  private writeToFile(level: string, message: string) {
    const formattedMessage = this.formatMessage(level, message);
    const logFile = path.join(this.logDir, `${level}.log`);
    
    fs.appendFileSync(logFile, formattedMessage);
    
    // Also write to combined log
    const combinedLogFile = path.join(this.logDir, 'combined.log');
    fs.appendFileSync(combinedLogFile, formattedMessage);
  }

  info(message: string) {
    const formattedMessage = this.formatMessage('info', message);
    console.log(formattedMessage);
    this.writeToFile('info', message);
  }

  error(message: string) {
    const formattedMessage = this.formatMessage('error', message);
    console.error(formattedMessage);
    this.writeToFile('error', message);
  }

  warn(message: string) {
    const formattedMessage = this.formatMessage('warn', message);
    console.warn(formattedMessage);
    this.writeToFile('warn', message);
  }

  debug(message: string) {
    if (process.env.NODE_ENV === 'development') {
      const formattedMessage = this.formatMessage('debug', message);
      console.debug(formattedMessage);
      this.writeToFile('debug', message);
    }
  }
}

export const logger = new Logger();