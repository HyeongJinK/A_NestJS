import 'reflect-metadata';
import {InstanceWrapper} from "./container";
import {isFunction, isNil, isUndefined} from "../../common/shared.utils";
import {Logger} from "../../common/services/logger.service";
import {Controller} from "../../common/interfaces/controllers/controller.interface";
import {RuntimeException} from "../errors/exceptions/runtime.exception";
import {Module} from "./module";
import {Metatype} from "../../common/interfaces/metatype.interface";
import {PARAMTYPES_METADATA, SELF_DECLARED_DEPS_METADATA} from "../../common/constants";
import {UndefinedDependencyException} from "../errors/exceptions/undefined-dependency.exception";
import {Injectable} from "../../common/interfaces/injectable.interface";
import {UnknownDependenciesException} from "../errors/exceptions/unknown-dependencies.exception";


export class Injector {
    private readonly logger = new Logger(Injector.name, true);

    /**
     * Prototype
     * instance에 프로토 타입 추가
     * */
    public loadPrototypeOfInstance<T>(target: InstanceWrapper<T>, collection: Map<string, InstanceWrapper<T>>) {
        if (target && (target.isResolved || !isNil(target.inject))) return null;

        const {metatype, name} = target;

        this.logger.log(`loadPrototypeOfInstance() before collection.get(name): ${collection.get(name).instance}`);
        collection.set(name, {
            ...target,
            instance: Object.create(metatype.prototype),
        });
        this.logger.log(`loadPrototypeOfInstance() after collection.get(name): ${collection.get(name).instance}`);
    }
}