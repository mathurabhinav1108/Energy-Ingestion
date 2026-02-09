import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  VehicleTelemetryHistory,
  MeterTelemetryHistory,
} from '../database/entities';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(VehicleTelemetryHistory)
    private vehicleRepo: Repository<VehicleTelemetryHistory>,

    @InjectRepository(MeterTelemetryHistory)
    private meterRepo: Repository<MeterTelemetryHistory>,
  ) {}

  async getPerformance(vehicleId: string) {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const dc = await this.vehicleRepo
      .createQueryBuilder('v')
      .select('SUM(v.kwhDeliveredDc)', 'totalDc')
      .addSelect('AVG(v.batteryTemp)', 'avgTemp')
      .where('v.vehicleId = :vehicleId', { vehicleId })
      .andWhere('v.timestamp >= :since', { since })
      .getRawOne();

    const ac = await this.meterRepo
      .createQueryBuilder('m')
      .select('SUM(m.kwhConsumedAc)', 'totalAc')
      .andWhere('m.timestamp >= :since', { since })
      .getRawOne();

    return {
      totalAc: Number(ac.totalAc || 0),
      totalDc: Number(dc.totalDc || 0),
      efficiency:
        ac.totalAc && dc.totalDc ? dc.totalDc / ac.totalAc : null,
      avgBatteryTemp: Number(dc.avgTemp || 0),
    };
  }
}