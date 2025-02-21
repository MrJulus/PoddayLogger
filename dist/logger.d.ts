interface LoggerOptions {
    discordWebhookUrl?: string;
    discordMessageType?: 'embed' | 'simple';
    discordFilterLevels?: string[];
    filterLevels?: string[];
    colors?: Record<string, {
        color: string;
        bg?: string;
        supl?: string;
    }>;
    timestampFormat?: string;
    silent?: boolean;
    logFilePath?: string;
    prefix?: string;
}
export declare class Logger {
    private static webhookUrl;
    private static messageType;
    private static colors;
    private static timestampFormat;
    private static silent;
    private static discordFilterLevels;
    private static filterLevels;
    private static customLevels;
    private static stats;
    private static logFilePath?;
    private static prefix;
    private static timers;
    static init(options: LoggerOptions): void;
    static addCustomLevel(level: string, color: string, bg?: string, supl?: string): void;
    static Custom(level: string, message: string): void;
    static send(message: string): void;
    static info(message: string): void;
    static success(message: string): void;
    static debug(message: string): void;
    static warn(message: string): void;
    static error(message: string, error?: Error): void;
    static startTimer(label: string): void;
    static stopTimer(label: string, message?: string): void;
    private static logMessage;
    private static writeToFile;
    private static sendToDiscord;
    private static getDiscordColor;
    private static getColorFunction;
    private static formatTimestamp;
    private static extractLocation;
    static colorize(color: string, text: string): string;
    static updateOptions(newOptions: Partial<LoggerOptions>): void;
    static getStats(): Record<string, number>;
    static getStatsDetails(): string;
}
export {};
