// src/core/express-adapter.ts
import express, { Application } from 'express';

export class ExpressAdapter {
    private app: Application;

    constructor() {
        this.app = express();
    }

    listen(port: number, callback: () => void) {
        this.app.listen(port, callback);
    }
}