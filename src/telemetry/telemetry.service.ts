import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  VehicleTelemetryHistory,
  MeterTelemetryHistory,
  VehicleLiveStatus,
  MeterLiveStatus,
} from '../database/entities';

@Injectable()
export class TelemetryService {
  constructor(
    @InjectRepository(VehicleTelemetryHistory)
    private vehicleHistoryRepo: Repository<VehicleTelemetryHistory>,

    @InjectRepository(MeterTelemetryHistory)
    private meterHistoryRepo: Repository<MeterTelemetryHistory>,

    @InjectRepository(VehicleLiveStatus)
    private vehicleLiveRepo: Repository<VehicleLiveStatus>,

    @InjectRepository(MeterLiveStatus)
    private meterLiveRepo: Repository<MeterLiveStatus>,
  ) {}

  async ingest(payload: any) {
    if (payload.vehicleId) {
      return this.handleVehicleTelemetry(payload);
    }

    if (payload.meterId) {
      return this.handleMeterTelemetry(payload);
    }

    throw new BadRequestException('Invalid telemetry payload');
  }

  private async handleVehicleTelemetry(data: any) {
    const timestamp = new Date(data.timestamp);

    // 1️⃣ INSERT into history (cold)
    await this.vehicleHistoryRepo.insert({
      vehicleId: data.vehicleId,
      kwhDeliveredDc: data.kwhDeliveredDc,
      batteryTemp: data.batteryTemp,
      soc: data.soc,
      timestamp,
    });

    // 2️⃣ UPSERT into live (hot)
    await this.vehicleLiveRepo.upsert(
      {
        vehicleId: data.vehicleId,
        soc: data.soc,
        batteryTemp: data.batteryTemp,
        lastKwhDeliveredDc: data.kwhDeliveredDc,
        updatedAt: new Date(),
      },
      ['vehicleId'],
    );

    return { status: 'vehicle telemetry ingested' };
  }

  private async handleMeterTelemetry(data: any) {
    const timestamp = new Date(data.timestamp);

    // 1️⃣ INSERT into history
    await this.meterHistoryRepo.insert({
      meterId: data.meterId,
      kwhConsumedAc: data.kwhConsumedAc,
      voltage: data.voltage,
      timestamp,
    });

    // 2️⃣ UPSERT into live
    await this.meterLiveRepo.upsert(
      {
        meterId: data.meterId,
        voltage: data.voltage,
        lastKwhConsumedAc: data.kwhConsumedAc,
        updatedAt: new Date(),
      },
      ['meterId'],
    );

    return { status: 'meter telemetry ingested' };
  }
}