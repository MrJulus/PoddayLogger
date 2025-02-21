"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
const logViewer_1 = require("./logViewer");
logger_1.Logger.init({
    discordWebhookUrl: 'https://discord.com/api/webhooks/.../...',
    discordMessageType: 'embed',
    discordFilterLevels: ['error', 'warn'],
    filterLevels: ['debug'],
    logFilePath: 'logs/app.log',
    prefix: '[App] ',
    colors: {
        info: { color: 'blue' },
        debug: { color: 'gray' },
        success: { color: 'green' },
        warn: { color: 'yellow' },
        error: { color: 'red' }
    },
    timestampFormat: 'YYYY-MM-DD HH:mm:ss',
    silent: false
});
logger_1.Logger.addCustomLevel('customLevel', 'magenta', 'black', 'bold');
logger_1.Logger.Custom('customLevel', 'Message with custom level.');
logger_1.Logger.send('Message sent via send method.');
logger_1.Logger.info('This is an info message.');
logger_1.Logger.success('Operation successful!');
logger_1.Logger.debug('This is a debug message.');
logger_1.Logger.warn('Warning: Something might be wrong.');
logger_1.Logger.error('An error occurred.', new Error('Test Error'));
logger_1.Logger.startTimer('testTimer');
setTimeout(() => {
    logger_1.Logger.stopTimer('testTimer', 'Timer testTimer duration');
}, 1000);
logger_1.Logger.getStats();
logger_1.Logger.colorize('cyan', 'Text in cyan.');
logger_1.Logger.updateOptions({ silent: true });
logger_1.Logger.getStatsDetails();
const viewer = new logViewer_1.LogViewer('logs/app.log');
viewer.viewLog();
