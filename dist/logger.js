"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const chalk_1 = __importDefault(require("chalk"));
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const DEFAULT_COLORS = {
    info: { color: 'blue' },
    debug: { color: 'gray' },
    success: { color: 'green' },
    warn: { color: 'yellow' },
    error: { color: 'red' },
};
class Logger {
    static webhookUrl;
    static messageType = 'simple';
    static colors = { ...DEFAULT_COLORS };
    static timestampFormat = 'YYYY-MM-DD HH:mm:ss';
    static silent = false;
    static discordFilterLevels;
    static filterLevels = [];
    static customLevels = {};
    static stats = {};
    static logFilePath;
    static prefix = '';
    static timers = new Map();
    static init(options) {
        this.webhookUrl = options.discordWebhookUrl;
        this.messageType = options.discordMessageType || 'simple';
        this.discordFilterLevels = options.discordFilterLevels;
        this.filterLevels = options.filterLevels || [];
        this.colors = { ...DEFAULT_COLORS, ...options.colors };
        this.timestampFormat = options.timestampFormat || 'YYYY-MM-DD HH:mm:ss';
        this.silent = options.silent || false;
        this.logFilePath = options.logFilePath;
        this.prefix = options.prefix || '';
    }
    static addCustomLevel(level, color, bg, supl) {
        this.customLevels[level.toLowerCase()] = { color, bg, supl };
        if (!(level in this)) {
            this[level] = (message) => {
                this.logMessage(level.toUpperCase(), message);
            };
        }
        else {
            console.warn(`${level} is already defined.`);
        }
    }
    static Custom(level, message) {
        const lowerLevel = level.toLowerCase();
        if (this.customLevels[lowerLevel]) {
            this.logMessage(level.toUpperCase(), message);
        }
        else {
            this.error(`"${level}" is undefined.`);
        }
    }
    static send(message) {
        console.log(message);
        this.writeToFile(message);
    }
    static info(message) {
        this.logMessage('INFO', message);
    }
    static success(message) {
        this.logMessage('SUCCESS', message);
    }
    static debug(message) {
        this.logMessage('DEBUG', message);
    }
    static warn(message) {
        this.logMessage('WARN', message);
    }
    static error(message, error) {
        this.logMessage('ERROR', message, error);
    }
    static startTimer(label) {
        this.timers.set(label, Date.now());
    }
    static stopTimer(label, message = 'Timer stopped') {
        const startTime = this.timers.get(label);
        if (startTime) {
            const duration = Date.now() - startTime;
            this.timers.delete(label);
            this.info(`${message} - ${duration}ms`);
        }
        else {
            this.warn(`Timer '${label}' not found.`);
        }
    }
    static logMessage(level, message, error) {
        if (this.filterLevels.length > 0 && !this.filterLevels.includes(level.toLowerCase())) {
            return;
        }
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
    static writeToFile(message) {
        if (!this.logFilePath)
            return;
        try {
            const logDir = path_1.default.dirname(this.logFilePath);
            if (!fs_1.default.existsSync(logDir))
                fs_1.default.mkdirSync(logDir, { recursive: true });
            fs_1.default.appendFileSync(this.logFilePath, message + '\n');
        }
        catch (err) {
            if (!this.silent)
                console.error(chalk_1.default.red('Erreur lors de l’écriture dans le fichier de log :'), err);
        }
    }
    static async sendToDiscord(level, message) {
        if (this.webhookUrl && (!this.discordFilterLevels || this.discordFilterLevels.includes(level.toLowerCase()))) {
            try {
                const payload = this.messageType === 'embed'
                    ? { embeds: [{ title: `${level} Message`, description: message, color: this.getDiscordColor(level), timestamp: new Date().toISOString() }] }
                    : { content: message };
                await axios_1.default.post(this.webhookUrl, payload);
            }
            catch (error) {
                if (!this.silent)
                    console.error(chalk_1.default.red('Failed to send message to Discord:'), error);
            }
        }
    }
    static getDiscordColor(level) {
        switch (level) {
            case 'INFO': return 3447003;
            case 'SUCCESS': return 3066993;
            case 'WARN': return 16776960;
            case 'ERROR': return 15158332;
            default: return 0;
        }
    }
    static getColorFunction(color, bg, supl) {
        let colorFunc = chalk_1.default[color] || chalk_1.default.white;
        if (bg)
            colorFunc = colorFunc[`bg${bg.charAt(0).toUpperCase() + bg.slice(1)}`] || colorFunc;
        if (supl)
            colorFunc = colorFunc[supl] || colorFunc;
        return colorFunc;
    }
    static formatTimestamp() {
        const date = new Date();
        return this.timestampFormat.replace(/YYYY/, String(date.getFullYear()))
            .replace(/MM/, String(date.getMonth() + 1).padStart(2, '0'))
            .replace(/DD/, String(date.getDate()).padStart(2, '0'))
            .replace(/HH/, String(date.getHours()).padStart(2, '0'))
            .replace(/mm/, String(date.getMinutes()).padStart(2, '0'))
            .replace(/ss/, String(date.getSeconds()).padStart(2, '0'));
    }
    static extractLocation(stack) {
        const lines = stack.split('\n').filter((line) => line.includes('at '));
        const relevantLine = lines.find((l) => !l.includes('Logger.'));
        return relevantLine || lines[0] || '';
    }
    static colorize(color, text) {
        return chalk_1.default[color](text);
    }
    static updateOptions(newOptions) {
        Object.assign(this, newOptions);
    }
    static getStats() {
        return { ...this.stats };
    }
    static getStatsDetails() {
        const total = Object.values(this.stats).reduce((sum, count) => sum + count, 0);
        return `📊 Logs recorded: ${total} - ${JSON.stringify(this.stats)}`;
    }
}
exports.Logger = Logger;
