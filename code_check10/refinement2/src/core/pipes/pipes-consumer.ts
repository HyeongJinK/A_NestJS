// import { ParamsTokenFactory } from './params-token-factory';
// import {ArgumentMetadata, PipeTransform} from "../../common/interfaces";
// import {RouteParamtypes} from "../../common/enums/route-paramtypes.enum";
//
// class PipesConsumer {
//   private readonly paramsTokenFactory = new ParamsTokenFactory();
//
//   public async apply<TInput = unknown>(
//     value: TInput,
//     { metatype, type, data }: ArgumentMetadata,
//     pipes: PipeTransform[],
//   ) {
//     const token = this.paramsTokenFactory.exchangeEnumForString(
//       type as any as RouteParamtypes,
//     );
//     return this.applyPipes(value, { metatype, type: token, data }, pipes);
//   }
//
//   public async applyPipes<TInput = unknown>(
//     value: TInput,
//     { metatype, type, data }: { metatype: any; type?: any; data?: any },
//     transforms: PipeTransform[],
//   ) {
//     return transforms.reduce(async (deferredValue, pipe) => {
//       const val = await deferredValue;
//       const result = pipe.transform(val, { metatype, type, data });
//       return result;
//     }, Promise.resolve(value));
//   }
// }
