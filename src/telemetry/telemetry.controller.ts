import {
  Controller,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { TelemetryService } from './telemetry.service';
import { VehicleTelemetryDto } from './dto/vehicle-telemetry.dto';
import { MeterTelemetryDto } from './dto/meter-telemetry.dto';

@Controller('v1/telemetry')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Post()
  ingest(
    @Body() payload: VehicleTelemetryDto | MeterTelemetryDto,
  ) {
    if ('vehicleId' in payload) {
      return this.telemetryService.ingestVehicle(payload);
    }

    if ('meterId' in payload) {
      return this.telemetryService.ingestMeter(payload);
    }

    throw new BadRequestException('Invalid telemetry payload');
  }
}
