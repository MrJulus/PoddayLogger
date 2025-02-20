"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
const logViewer_1 = require("./logViewer");
logger_1.Logger.init({
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
logger_1.Logger.addCustomLevel('customLevel', 'magenta', 'black', 'bold');
logger_1.Logger.Custom('customLevel', 'Message avec niveau personnalisé.');
logger_1.Logger.send('Message envoyé par la méthode send.');
logger_1.Logger.info('Ceci est un message d\'information.');
logger_1.Logger.success('Opération réussie !');
logger_1.Logger.debug('Ceci est un message de debug.');
logger_1.Logger.warn('Attention, ceci est un avertissement.');
logger_1.Logger.error('Une erreur est survenue.', new Error('Erreur testée'));
logger_1.Logger.startTimer('testTimer');
setTimeout(() => {
    logger_1.Logger.stopTimer('testTimer', 'Durée écoulée pour le timer testTimer');
    ;
}, 1000);
logger_1.Logger.getStats();
logger_1.Logger.colorize('cyan', 'Texte coloré en cyan.');
const viewer = new logViewer_1.LogViewer('logs/app.log');
viewer.viewLog();
