import * as http from 'http';
import * as bodyParser from 'body-parser';
import {Logger} from "../common/services/logger.service";
import {NestContainer} from "./injector/container";
import {ApplicationConfig} from "./application-config";
import {ExpressAdapter} from "./adapters/express-adapter";
import {RoutesResolver} from "./router/routes-resolver";
import {validatePath} from "../common/shared.utils";


export class NestApplication {
    private readonly logger = new Logger(NestApplication.name, true);
    private readonly config: ApplicationConfig;
    private readonly routesResolver: RoutesResolver = null;
    private readonly httpServer: http.Server = null;
    private isInitialized = false;

    constructor(
        private readonly container: NestContainer,
        private readonly express,
    ) {
        this.setupParserMiddlewares();
        this.httpServer = http.createServer(express);
        this.config = new ApplicationConfig();

        this.routesResolver = new RoutesResolver(
            container, ExpressAdapter
        );
    }

    public setupParserMiddlewares() {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: true }));
    }

    public async listen(port: number, callback?: () => void);
    public async listen(port: number, hostname: string, callback?: () => void);
    public async listen(port: number, ...args) {
        (!this.isInitialized) && await this.init();

        this.httpServer.listen(port, ...args);
        return this.httpServer;
    }

    public async init() {
        await this.setupRouter();

        this.logger.log(`Nest application successfully started`);
        this.isInitialized = true;
    }

    public async setupRouter() {
        // Express에 라우터를 생성
        const router = ExpressAdapter.createRouter();

        this.routesResolver.resolve(router);
        this.express.use(validatePath(this.config.getGlobalPrefix()), router);
    }

    public use(requestHandler) {
        this.express.use(requestHandler);
    }
}