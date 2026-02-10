import { Repository } from 'typeorm';
import { VehicleTelemetryHistory, MeterTelemetryHistory, VehicleLiveStatus, MeterLiveStatus } from '../database/entities';
import { VehicleTelemetryDto } from './dto/vehicle-telemetry.dto';
import { MeterTelemetryDto } from './dto/meter-telemetry.dto';
export declare class TelemetryService {
    private vehicleHistoryRepo;
    private meterHistoryRepo;
    private vehicleLiveRepo;
    private meterLiveRepo;
    constructor(vehicleHistoryRepo: Repository<VehicleTelemetryHistory>, meterHistoryRepo: Repository<MeterTelemetryHistory>, vehicleLiveRepo: Repository<VehicleLiveStatus>, meterLiveRepo: Repository<MeterLiveStatus>);
    ingestVehicle(data: VehicleTelemetryDto): Promise<{
        status: string;
    }>;
    ingestMeter(data: MeterTelemetryDto): Promise<{
        status: string;
    }>;
}
