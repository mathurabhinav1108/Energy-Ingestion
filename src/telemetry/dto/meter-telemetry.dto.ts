import {
  IsString,
  IsNumber,
  Min,
  IsISO8601,
} from 'class-validator';

export class MeterTelemetryDto {
  @IsString()
  meterId: string;

  @IsNumber()
  @Min(0)
  kwhConsumedAc: number;

  @IsNumber()
  @Min(0)
  voltage: number;

  @IsISO8601()
  timestamp: string;
}
