import {
  IsString,
  IsInt,
  IsNumber,
  Min,
  Max,
  IsISO8601,
} from 'class-validator';

export class VehicleTelemetryDto {
  @IsString()
  vehicleId: string;

  @IsInt()
  @Min(0)
  @Max(100)
  soc: number;

  @IsNumber()
  @Min(0)
  kwhDeliveredDc: number;

  @IsNumber()
  batteryTemp: number;

  @IsISO8601()
  timestamp: string;
}
