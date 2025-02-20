export declare class LogViewer {
    private filePath;
    private filterLevel?;
    constructor(filePath: string, filterLevel?: string);
    private parseLogLine;
    viewLog(): void;
}
