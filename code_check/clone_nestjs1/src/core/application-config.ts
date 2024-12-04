import * as optional from 'optional';
import {ConfigurationProvider} from "../common/interfaces/configuration-provider.interface";
import {PipeTransform} from "../common/interfaces/pipe-transform.interface";
import {ExceptionFilter} from "../common/exceptions/exception-filter.interface";
import {NestInterceptor} from "../common/interfaces/nest-interceptor.interface";
import {CanActivate} from "../common/interfaces/can-activate.interface";
import {WebSocketAdapter} from "../common/interfaces/web-socket-adapter.interface";
// import { PipeTransform, WebSocketAdapter, ExceptionFilter, NestInterceptor, CanActivate } from '@nestjs/common';
// import { ConfigurationProvider } from '@nestjs/common/interfaces/configuration-provider.interface';

export class ApplicationConfig implements ConfigurationProvider {
    private globalPipes: PipeTransform<any>[] = [];
    private globalFilters: ExceptionFilter[] = [];
    private globalInterceptors: NestInterceptor[] = [];
    private globalGuards: CanActivate[] = [];
    private globalPrefix = '';

    constructor(private ioAdapter: WebSocketAdapter | null = null) {}

    public setGlobalPrefix(prefix: string) {
        this.globalPrefix = prefix;
    }

    public getGlobalPrefix() {
        return this.globalPrefix;
    }

    public setIoAdapter(ioAdapter: WebSocketAdapter) {
        this.ioAdapter = ioAdapter;
    }

    public getIoAdapter(): WebSocketAdapter | null {
        return this.ioAdapter;
    }

    public useGlobalPipes(...pipes: PipeTransform<any>[]) {
        this.globalPipes = pipes;
    }

    public getGlobalFilters(): ExceptionFilter[] {
        return this.globalFilters;
    }

    public useGlobalFilters(...filters: ExceptionFilter[]) {
        this.globalFilters = filters;
    }

    public getGlobalPipes(): PipeTransform<any>[] {
        return this.globalPipes;
    }

    public getGlobalInterceptors(): NestInterceptor[] {
        return this.globalInterceptors;
    }

    public useGlobalInterceptors(...interceptors: NestInterceptor[]) {
        this.globalInterceptors = interceptors;
    }

    public getGlobalGuards(): CanActivate[] {
        return this.globalGuards;
    }

    public useGlobalGuards(...guards: CanActivate[]) {
        this.globalGuards = guards;
    }
}