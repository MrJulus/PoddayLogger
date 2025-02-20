import chalk from 'chalk';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

interface LoggerOptions {
  discordWebhookUrl?: string;
  discordMessageType?: 'embed' | 'simple';
  discordFilterLevels?: string[];
  colors?: Record<string, { color: string, bg?: string, supl?: string }>;
  timestampFormat?: string;
  silent?: boolean;
  logFilePath?: string;
  prefix?: string;
}

const DEFAULT_COLORS = {
  info: { color: 'blue' },
  debug: { color: 'gray' },
  success: { color: 'green' },
  warn: { color: 'yellow' },
  error: { color: 'red' },
} as const;

export class Logger {
    private static webhookUrl: string | undefined;
    private static messageType: 'embed' | 'simple' = 'simple';
    private static colors: Record<string, { color: string, bg?: string, supl?: string }> = { ...DEFAULT_COLORS };
    private static timestampFormat: string = 'YYYY-MM-DD HH:mm:ss';
    private static silent: boolean = false;
    private static discordFilterLevels: string[] | undefined;
    private static customLevels: Record<string, { color: string, bg?: string, supl?: string }> = {};
    private static stats: Record<string, number> = {};
    private static logFilePath?: string;
    private static prefix: string = '';
    private static timers: Map<string, number> = new Map();

    static init(options: LoggerOptions) {
        this.webhookUrl = options.discordWebhookUrl;
        this.messageType = options.discordMessageType || 'simple';
        this.discordFilterLevels = options.discordFilterLevels;
        this.colors = { ...DEFAULT_COLORS, ...options.colors };
        this.timestampFormat = options.timestampFormat || 'YYYY-MM-DD HH:mm:ss';
        this.silent = options.silent || false;
        this.logFilePath = options.logFilePath;
        this.prefix = options.prefix || '';
    }

    static addCustomLevel(level: string, color: string, bg?: string, supl?: string) {
        this.customLevels[level.toLowerCase()] = { color, bg, supl };
        if (!(level in this)) {
            (this as any)[level] = (message: string) => {
                this.logMessage(level.toUpperCase(), message);
            };
        } else {
            console.warn(`${level} is already defined.`);
        }
    }    

    static Custom(level: string, message: string) {
        const lowerLevel = level.toLowerCase();
        if (this.customLevels[lowerLevel]) {
            this.logMessage(level.toUpperCase(), message);
        } else {
            this.error(`"${level}" is undefined.`);
        }
    }  
    
    static send(message: string) {
        console.log(message);
        this.writeToFile(message);
    }

    static info(message: string) {
        this.logMessage('INFO', message);
    }

    static success(message: string) {
        this.logMessage('SUCCESS', message);
    }

    static debug(message: string) {
        this.logMessage('DEBUG', message);
    }

    static warn(message: string) {
        this.logMessage('WARN', message);
    }

    static error(message: string, error?: Error) {
        this.logMessage('ERROR', message, error);
    }

    static startTimer(label: string) {
        this.timers.set(label, Date.now());
    }

    static stopTimer(label: string, message: string = 'Timer stopped') {
        const startTime = this.timers.get(label);
        if (startTime) {
            const duration = Date.now() - startTime;
            this.timers.delete(label);
            this.info(`${message} - ${duration}ms`);
        } else {
            this.warn(`Timer '${label}' not found.`);
        }
    }

    private static logMessage(level: string, message: string, error?: Error) {
        const timestamp = this.formatTimestamp();
        const location = level === 'ERROR' && error?.stack ? this.extractLocation(error.stack) : '';
        const formattedMessage = `${this.prefix}[${timestamp}] [${level}] ${message} ${location}`.trim();
        const { color, bg, supl } = this.customLevels[level.toLowerCase()] || this.colors[level.toLowerCase()] || { color: 'white' };

        if (!this.silent) {
            console.log(this.getColorFunction(color, bg, supl)(formattedMessage));
        }

        this.writeToFile(formattedMessage);
        this.sendToDiscord(level, formattedMessage);
        this.stats[level.toLowerCase()] = (this.stats[level.toLowerCase()] || 0) + 1;
    }

    private static writeToFile(message: string) {
        if (!this.logFilePath) return;
        try {
            const logDir = path.dirname(this.logFilePath);
            if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
            fs.appendFileSync(this.logFilePath, message + '\n');
        } catch (err) {
            if (!this.silent) console.error(chalk.red('Erreur lors de l’écriture dans le fichier de log :'), err);
        }
    }    

    private static async sendToDiscord(level: string, message: string) {
        if (this.webhookUrl && (!this.discordFilterLevels || this.discordFilterLevels.includes(level.toLowerCase()))) {
        try {
            const payload = this.messageType === 'embed'
            ? { embeds: [{ title: `${level} Message`, description: message, color: this.getDiscordColor(level), timestamp: new Date().toISOString() }] }
            : { content: message };
            await axios.post(this.webhookUrl, payload);
        } catch (error) {
            if (!this.silent) console.error(chalk.red('Failed to send message to Discord:'), error);
        }
        }
    }

    private static getDiscordColor(level: string): number {
        switch (level) {
        case 'INFO': return 3447003;
        case 'SUCCESS': return 3066993;
        case 'WARN': return 16776960;
        case 'ERROR': return 15158332;
        default: return 0;
        }
    }

    private static getColorFunction(color: string, bg?: string, supl?: string) {
        let colorFunc = (chalk as any)[color] || chalk.white;
        if (bg) colorFunc = colorFunc[`bg${bg.charAt(0).toUpperCase() + bg.slice(1)}`] || colorFunc;
        if (supl) colorFunc = colorFunc[supl] || colorFunc;
        return colorFunc;
    }

    private static formatTimestamp(): string {
        const date = new Date();
        return this.timestampFormat.replace(/YYYY/, String(date.getFullYear()))
        .replace(/MM/, String(date.getMonth() + 1).padStart(2, '0'))
        .replace(/DD/, String(date.getDate()).padStart(2, '0'))
        .replace(/HH/, String(date.getHours()).padStart(2, '0'))
        .replace(/mm/, String(date.getMinutes()).padStart(2, '0'))
        .replace(/ss/, String(date.getSeconds()).padStart(2, '0'));
    }

    private static extractLocation(stack: string): string {
        const lines = stack.split('\n').filter((line) => line.includes('at '));
        const relevantLine = lines.find((l) => !l.includes('Logger.'));
        return relevantLine || lines[0] || '';
    }    

    static colorize(color: string, text: string): string {
        return (chalk as any)[color](text);
    }

    static getStats(): Record<string, number> {
        return { ...this.stats };
    }
}