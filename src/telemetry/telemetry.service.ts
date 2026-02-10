import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  VehicleTelemetryHistory,
  MeterTelemetryHistory,
  VehicleLiveStatus,
  MeterLiveStatus,
} from '../database/entities';
import { VehicleTelemetryDto } from './dto/vehicle-telemetry.dto';
import { MeterTelemetryDto } from './dto/meter-telemetry.dto';

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

  async ingestVehicle(data: VehicleTelemetryDto) {
    const timestamp = new Date(data.timestamp);

    // Cold path (INSERT)
    await this.vehicleHistoryRepo.insert({
      vehicleId: data.vehicleId,
      kwhDeliveredDc: data.kwhDeliveredDc,
      batteryTemp: data.batteryTemp,
      soc: data.soc,
      timestamp,
    });

    // Hot path (UPSERT)
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

  async ingestMeter(data: MeterTelemetryDto) {
    const timestamp = new Date(data.timestamp);

    // Cold path (INSERT)
    await this.meterHistoryRepo.insert({
      meterId: data.meterId,
      kwhConsumedAc: data.kwhConsumedAc,
      voltage: data.voltage,
      timestamp,
    });

    // Hot path (UPSERT)
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
