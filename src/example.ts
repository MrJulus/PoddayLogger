import { Logger } from './logger';
import { LogViewer } from './logViewer';

Logger.init({
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

Logger.addCustomLevel('customLevel', 'magenta', 'black', 'bold');
Logger.Custom('customLevel', 'Message with custom level.');

Logger.send('Message sent via send method.');
Logger.info('This is an info message.');
Logger.success('Operation successful!');
Logger.debug('This is a debug message.');
Logger.warn('Warning: Something might be wrong.');
Logger.error('An error occurred.', new Error('Test Error'));

Logger.startTimer('testTimer');
setTimeout(() => {
  Logger.stopTimer('testTimer', 'Timer testTimer duration');
}, 1000);

Logger.getStats();
Logger.colorize('cyan', 'Text in cyan.');
Logger.updateOptions({ silent: true });
Logger.getStatsDetails()

const viewer = new LogViewer('logs/app.log');
viewer.viewLog();