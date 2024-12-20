import {NestEnvironment} from "../enums/nest-environment.enum";
import clc from "cli-color";


declare const process: { stdout: { write: (msg: string) => void }, pid: number };

export class Logger {
    private static lastTimestamp: number | null = null;
    private static contextEnv = NestEnvironment.RUN;
    private readonly yellow = clc.xterm(3);

    constructor(
        private readonly context: string,
        private readonly printTimestamps = false) {}

    public static setMode(mode: NestEnvironment) {
        this.contextEnv = mode;
    }

    public log(message: string) {
        this.printMessage(message, clc.green);
    }

    public log_cyan(message: string) {
        this.printMessage(message, clc.cyan);
    }

    public log_blue(message: string) {
        this.printMessage(message, clc.blue);
    }

    public error(message: string, trace = '') {
        this.printMessage(message, clc.red);
        this.printStackTrace(trace);
    }

    public warn(message: string) {
        this.printMessage(message, clc.yellow);
    }

    private printMessage(message: string, color: (msg: string) => string) {
        if (Logger.contextEnv === NestEnvironment.TEST) return;

        process.stdout.write(color(`[Nest] ${process.pid}   - `));
        process.stdout.write(`${new Date(Date.now()).toLocaleString()}   `);
        process.stdout.write(this.yellow(`[${this.context}] `));
        process.stdout.write(color(message));

        this.printTimestamp();
        process.stdout.write(`\n`);
    }

    private printTimestamp() {
        const includeTimestamp = Logger.lastTimestamp && this.printTimestamps;
        if (includeTimestamp && Logger.lastTimestamp) {
            process.stdout.write(this.yellow(` +${Date.now() - Logger.lastTimestamp}ms`));
        }
        Logger.lastTimestamp = Date.now();

    }

    private printStackTrace(trace: string) {
        if (Logger.contextEnv === NestEnvironment.TEST || !trace) return;

        process.stdout.write(trace);
        process.stdout.write(`\n`);
    }
}