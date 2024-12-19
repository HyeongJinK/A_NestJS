import {Injectable} from "./common/decorators";

@Injectable()
export class TestService {
    getHello(): string {
        return 'Hello World!';
    }
}