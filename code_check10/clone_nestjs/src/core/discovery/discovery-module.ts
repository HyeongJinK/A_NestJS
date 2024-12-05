import { MetadataScanner } from '../metadata-scanner';
import { DiscoveryService } from './discovery-service';
import {Module} from "../../common/decorators";

/**
 * @publicApi
 */
@Module({
  providers: [MetadataScanner, DiscoveryService],
  exports: [MetadataScanner, DiscoveryService],
})
export class DiscoveryModule {}
