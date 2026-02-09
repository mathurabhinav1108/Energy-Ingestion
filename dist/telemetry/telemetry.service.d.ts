import { Repository } from 'typeorm';
import { VehicleTelemetryHistory, MeterTelemetryHistory, VehicleLiveStatus, MeterLiveStatus } from '../database/entities';
export declare class TelemetryService {
    private vehicleHistoryRepo;
    private meterHistoryRepo;
    private vehicleLiveRepo;
    private meterLiveRepo;
    constructor(vehicleHistoryRepo: Repository<VehicleTelemetryHistory>, meterHistoryRepo: Repository<MeterTelemetryHistory>, vehicleLiveRepo: Repository<VehicleLiveStatus>, meterLiveRepo: Repository<MeterLiveStatus>);
    ingest(payload: any): Promise<{
        status: string;
    }>;
    private handleVehicleTelemetry;
    private handleMeterTelemetry;
}
