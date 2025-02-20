import { Logger } from './logger';
import { LogViewer } from './logViewer';

Logger.init({
    discordWebhookUrl: 'https://discord.com/api/webhooks/.../...',
    discordMessageType: 'embed',
    discordFilterLevels: ['error', 'warn'],
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
Logger.Custom('customLevel', 'Message avec niveau personnalisé.');

Logger.send('Message envoyé par la méthode send.');
Logger.info('Ceci est un message d\'information.');
Logger.success('Opération réussie !');
Logger.debug('Ceci est un message de debug.');
Logger.warn('Attention, ceci est un avertissement.');
Logger.error('Une erreur est survenue.', new Error('Erreur testée'));

Logger.startTimer('testTimer');
setTimeout(() => {
  Logger.stopTimer('testTimer', 'Durée écoulée pour le timer testTimer');;
}, 1000);

Logger.getStats()
Logger.colorize('cyan', 'Texte coloré en cyan.')

const viewer = new LogViewer('logs/app.log');
viewer.viewLog();