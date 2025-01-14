import { Module } from './decorators/module.decorator';
import { UserModule } from './user/user.module';

@Module({
    imports: [UserModule],
})
export class AppModule {}