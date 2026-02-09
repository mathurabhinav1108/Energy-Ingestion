import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelemetryController } from './telemetry.controller';
import { TelemetryService } from './telemetry.service';
import {
  VehicleTelemetryHistory,
  MeterTelemetryHistory,
  VehicleLiveStatus,
  MeterLiveStatus,
} from '../database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VehicleTelemetryHistory,
      MeterTelemetryHistory,
      VehicleLiveStatus,
      MeterLiveStatus,
    ]),
  ],
  controllers: [TelemetryController],
  providers: [TelemetryService],
})
export class TelemetryModule {}