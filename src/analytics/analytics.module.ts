import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import {
  VehicleTelemetryHistory,
  MeterTelemetryHistory,
} from '../database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VehicleTelemetryHistory,
      MeterTelemetryHistory,
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}