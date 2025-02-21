# Podday Logger Documentation
## Overview
The **Podday Logger** is a robust logging utility for Node.js applications. It provides colorized console outputs, file logging, Discord webhook integration, custom log levels, and timer functionality.

---

## Installation
```bash
npm install podday-logger
```

---

## Logger Class

### Configuration Options (LoggerOptions)
| Parameter             | Type                | Description                                                                                        | Required |
|------------------------|---------------------|---------------------------------------------------------------------------------------------------|----------|
| discordWebhookUrl      | string              | Discord webhook URL to send logs to a Discord channel.                                            | No       |
| discordMessageType     | 'embed' \| 'simple' | Type of Discord message: `embed` for rich messages, `simple` for plain text.                      | No       |
| discordFilterLevels    | string[]            | Array of log levels to not be sent to Discord.                                                     | No       |
| filterLevels           | string[]            | Array of log levels to not be show in the console.                                                  | No       |
| colors                 | Record<string, Object> | Custom colors for log levels, e.g., `{ info: { color: 'blue' } }`.                                | No       |
| timestampFormat        | string              | Custom timestamp format, e.g., `YYYY-MM-DD HH:mm:ss`.                                              | No       |
| silent                 | boolean             | If `true`, disables console output.                                                               | No       |
| logFilePath            | string              | Path to log file. Logs will be saved to this file.                                                 | No       |
| prefix                 | string              | String to prefix all log messages with.                                                           | No       |

### `colors` Object Structure

The `colors` parameter allows customization of log level colors. Each log level can be assigned an object with the following properties:

| Property  | Type      | Description                                                                                      | Required |
|-----------|----------|--------------------------------------------------------------------------------------------------|----------|
| color     | string   | The primary text color (e.g., `'blue'`, `'red'`, `'green'`).                                    | No      |
| bg        | string   | Background color (optional, e.g., `'bgBlue'`, `'bgRed'`, `'bgGreen'`).                          | No       |
| supl      | string   | Additional text styling (optional, e.g., `'bold'`, `'italic'`, `'underline'`).                  | No       |

### Static Methods
| Method                        | Description                                                                                   |
|--------------------------------|-----------------------------------------------------------------------------------------------|
| `init(options: LoggerOptions)` | Initializes the logger with configuration options.                                              |
| `addCustomLevel(level, color, bg, supl)` | Adds a custom log level with specific text and background color and optional style.           |
| `Custom(level, message)`       | Logs a message using a custom level.                                                           |
| `send(message)`                | Prints a raw message to the console and logs it to the file.                                    |
| `info(message)`                | Logs an `INFO` message.                                                                         |
| `success(message)`             | Logs a `SUCCESS` message.                                                                      |
| `debug(message)`               | Logs a `DEBUG` message.                                                                        |
| `warn(message)`                | Logs a `WARN` message.                                                                         |
| `error(message, error?)`       | Logs an `ERROR` message, optionally including an error stack trace.                            |
| `startTimer(label)`            | Starts a performance timer with a given label.                                                 |
| `stopTimer(label, message?)`   | Stops a timer and logs the elapsed time.                                                       |
| `colorize(color, text)`        | Returns the text styled with a specific Chalk color.                                            |
| `getStats()`                   | Returns statistics on how many times each level was logged.                                     |
| `getStatsDetails()`            | Returns statistics in detail on how many times each level was logged.                            |
| `updateOptions()`              | Update a value in the init config                                                               |

---

## LogViewer Class

### Constructor
| Parameter   | Type   | Description                            | Required |
|-------------|--------|----------------------------------------|----------|
| filePath    | string | Path to the log file to be read.        | Yes      |
| filterLevel | string | (Optional) Log level to filter by.      | No       |

### Methods
| Method                | Description                                           |
|-----------------------|-------------------------------------------------------|
| `viewLog()`            | Reads and prints the log file, filtering by level if specified. |

---

## Example Usage
```typescript
import { Logger } from './src/logger';
import { LogViewer } from './src/logViewer';

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
```

## ❤️ Contributors
- **Mr_Julus** (@MrJulus)

---
💡 *Feel free to contribute by opening an issue or a pull request!*