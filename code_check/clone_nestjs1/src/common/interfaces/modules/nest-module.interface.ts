// import { MiddlewaresConsumer } from '../middlewares-consumer.interface';

import {MiddlewaresConsumer} from "../middlewares/middlewares-consumer.interface";

export interface NestModule {
    configure(consumer: MiddlewaresConsumer): MiddlewaresConsumer | void;
}