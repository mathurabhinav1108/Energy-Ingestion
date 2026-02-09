import { Repository } from 'typeorm';
import { VehicleTelemetryHistory, MeterTelemetryHistory } from '../database/entities';
export declare class AnalyticsService {
    private vehicleRepo;
    private meterRepo;
    constructor(vehicleRepo: Repository<VehicleTelemetryHistory>, meterRepo: Repository<MeterTelemetryHistory>);
    getPerformance(vehicleId: string): Promise<{
        totalAc: number;
        totalDc: number;
        efficiency: number | null;
        avgBatteryTemp: number;
    }>;
}
