export interface INestApplication {
    init(): Promise<void>;
    listen(port: number, callback?: () => void): Promise<any>;
}