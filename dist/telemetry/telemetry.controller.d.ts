import { TelemetryService } from './telemetry.service';
import { VehicleTelemetryDto } from './dto/vehicle-telemetry.dto';
import { MeterTelemetryDto } from './dto/meter-telemetry.dto';
export declare class TelemetryController {
    private readonly telemetryService;
    constructor(telemetryService: TelemetryService);
    ingest(payload: VehicleTelemetryDto | MeterTelemetryDto): Promise<{
        status: string;
    }>;
}
