import {
  CorsOptions,
  CorsOptionsDelegate,
} from './external/cors-options.interface';
import { CanActivate } from './features/can-activate.interface';
import { NestInterceptor } from './features/nest-interceptor.interface';
import { GlobalPrefixOptions } from './global-prefix-options.interface';
import { HttpServer } from './http/http-server.interface';
import {
  ExceptionFilter,
  PipeTransform,
} from './index';
import { INestApplicationContext } from './nest-application-context.interface';
import { VersioningOptions } from './version-options.interface';

/**
 * Interface defining the core NestApplication object.
 *
 * @publicApi
 */
export interface INestApplication<TServer = any>
  extends INestApplicationContext {
  /**
   * A wrapper function around HTTP adapter method: `adapter.use()`.
   * Example `app.use(cors())`
   *
   * @returns {this}
   */
  use(...args: any[]): this;

  /**
   * Enables CORS (Cross-Origin Resource Sharing)
   *
   * @returns {void}
   */
  enableCors(options?: CorsOptions | CorsOptionsDelegate<any>): void;

  /**
   * Enables Versioning for the application.
   * By default, URI-based versioning is used.
   *
   * @param {VersioningOptions} options
   * @returns {this}
   */
  enableVersioning(options?: VersioningOptions): this;

  /**
   * Starts the application.
   *
   * @param {number|string} port
   * @param {string} [hostname]
   * @param {Function} [callback] Optional callback
   * @returns {Promise} A Promise that, when resolved, is a reference to the underlying HttpServer.
   */
  listen(port: number | string, callback?: () => void): Promise<any>;
  listen(
    port: number | string,
    hostname: string,
    callback?: () => void,
  ): Promise<any>;

  /**
   * Returns the url the application is listening at, based on OS and IP version. Returns as an IP value either in IPv6 or IPv4
   *
   * @returns {Promise<string>} The IP where the server is listening
   */
  getUrl(): Promise<string>;

  /**
   * Registers a prefix for every HTTP route path.
   *
   * @param {string} prefix The prefix for every HTTP route path (for example `/v1/api`)
   * @param {GlobalPrefixOptions} options Global prefix options object
   * @returns {this}
   */
  setGlobalPrefix(prefix: string, options?: GlobalPrefixOptions): this;

  /**
   * Returns the underlying native HTTP server.
   *
   * @returns {TServer}
   */
  getHttpServer(): TServer;

  /**
   * Returns the underlying HTTP adapter.
   *
   * @returns {HttpServer}
   */
  getHttpAdapter(): HttpServer;


  /**
   * Registers exception filters as global filters (will be used within
   * every HTTP route handler)
   *
   * @param {...ExceptionFilter} filters
   */
  useGlobalFilters(...filters: ExceptionFilter[]): this;

  /**
   * Registers pipes as global pipes (will be used within every HTTP route handler)
   *
   * @param {...PipeTransform} pipes
   */
  useGlobalPipes(...pipes: PipeTransform<any>[]): this;

  /**
   * Registers interceptors as global interceptors (will be used within
   * every HTTP route handler)
   *
   * @param {...NestInterceptor} interceptors
   */
  useGlobalInterceptors(...interceptors: NestInterceptor[]): this;

  /**
   * Registers guards as global guards (will be used within every HTTP route handler)
   *
   * @param {...CanActivate} guards
   */
  useGlobalGuards(...guards: CanActivate[]): this;

  /**
   * Terminates the application (including NestApplication, Gateways, and each connected
   * microservice)
   *
   * @returns {Promise<void>}
   */
  close(): Promise<void>;
}
