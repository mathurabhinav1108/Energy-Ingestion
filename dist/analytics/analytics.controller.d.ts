import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getPerformance(vehicleId: string): Promise<{
        totalAc: number;
        totalDc: number;
        efficiency: number | null;
        avgBatteryTemp: number;
    }>;
}
