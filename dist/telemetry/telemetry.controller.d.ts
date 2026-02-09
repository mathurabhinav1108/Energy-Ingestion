import { TelemetryService } from './telemetry.service';
export declare class TelemetryController {
    private readonly telemetryService;
    constructor(telemetryService: TelemetryService);
    ingest(payload: any): Promise<{
        status: string;
    }>;
}
