"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogViewer = void 0;
const fs = __importStar(require("fs"));
const chalk_1 = __importDefault(require("chalk"));
const logColors = {
    INFO: chalk_1.default.blue,
    ERROR: chalk_1.default.red,
    WARN: chalk_1.default.yellow,
    DEBUG: chalk_1.default.gray,
    SUCCESS: chalk_1.default.green,
};
class LogViewer {
    filePath;
    filterLevel;
    constructor(filePath, filterLevel) {
        this.filePath = filePath;
        this.filterLevel = filterLevel?.toUpperCase();
    }
    parseLogLine(line) {
        const match = line.match(/^\[(.*?)\] \[(.*?)\] (.*)$/);
        if (!match)
            return null;
        const [, timestamp, level, message] = match;
        return { timestamp, level, message };
    }
    viewLog() {
        if (!fs.existsSync(this.filePath)) {
            console.error(chalk_1.default.red(`Fichier non trouvé : ${this.filePath}`));
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
                const colorFn = logColors[level.toUpperCase()] || chalk_1.default.white;
                console.log(`${chalk_1.default.gray(`[${timestamp}]`)} [${colorFn(level)}] ${message}`);
            });
        }
        catch (error) {
            console.error(chalk_1.default.red('Erreur lors de la lecture du fichier :'), error);
        }
    }
}
exports.LogViewer = LogViewer;
