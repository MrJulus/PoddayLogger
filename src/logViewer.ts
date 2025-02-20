import * as fs from 'fs';
import chalk from 'chalk';

const logColors: Record<string, (text: string) => string> = {
  INFO: chalk.blue,
  ERROR: chalk.red,
  WARN: chalk.yellow,
  DEBUG: chalk.gray,
  SUCCESS: chalk.green,
};

interface ParsedLogLine {
  timestamp: string;
  level: string;
  message: string;
}

export class LogViewer {
  private filePath: string;
  private filterLevel?: string;

  constructor(filePath: string, filterLevel?: string) {
    this.filePath = filePath;
    this.filterLevel = filterLevel?.toUpperCase();
  }

  private parseLogLine(line: string): ParsedLogLine | null {
    const match = line.match(/^\[(.*?)\] \[(.*?)\] (.*)$/);
    if (!match) return null;

    const [, timestamp, level, message] = match;
    return { timestamp, level, message };
  }

  public viewLog(): void {
    if (!fs.existsSync(this.filePath)) {
      console.error(chalk.red(`Fichier non trouvé : ${this.filePath}`));
      return;
    }

    try {
      const fileContent = fs.readFileSync(this.filePath, 'utf-8');
      const lines = fileContent.split('\n');

      lines.forEach((line) => {
        const log = this.parseLogLine(line);
        if (!log) {
          console.log(line);
          return;
        }

        const { timestamp, level, message } = log;
        if (this.filterLevel && level.toUpperCase() !== this.filterLevel) {
          return;
        }

        const colorFn = logColors[level.toUpperCase()] || chalk.white;
        console.log(`${chalk.gray(`[${timestamp}]`)} [${colorFn(level)}] ${message}`);
      });
    } catch (error) {
      console.error(chalk.red('Erreur lors de la lecture du fichier :'), error);
    }
  }
}