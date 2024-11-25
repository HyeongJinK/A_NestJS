import {ConfigurationProvider} from "../common/interfaces/configuration-provider.interface";

export class ApplicationConfig implements ConfigurationProvider {
    private globalPrefix = '';

    public setGlobalPrefix(prefix: string) {
        this.globalPrefix = prefix;
    }

    public getGlobalPrefix() {
        return this.globalPrefix;
    }
}