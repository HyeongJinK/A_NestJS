import { requestProvider } from '../../router/request/request-providers';
import { inquirerProvider } from '../inquirer/inquirer-providers';
import {Global, Module} from "../../../common/decorators";
import {DynamicModule, ExistingProvider, FactoryProvider, ValueProvider} from "../../../common/interfaces";

// const ReflectorAliasProvider = {
//   provide: Reflector.name,
//   useExisting: Reflector,
// };

@Global()
@Module({
  providers: [
    requestProvider,
    inquirerProvider,
  ],
  exports: [
    requestProvider,
    inquirerProvider,
  ],
})
export class InternalCoreModule {
  static register(
    providers: Array<ValueProvider | FactoryProvider | ExistingProvider>,
  ): DynamicModule {
    return {
      module: InternalCoreModule,
      providers: [...providers],
      exports: [...providers.map(item => item.provide)],
    };
  }
}
