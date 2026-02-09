import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  Check,
} from 'typeorm';

@Entity('vehicle_telemetry_history')
@Index(['vehicleId', 'timestamp'])
@Check(`"kwhDeliveredDc" >= 0`)
@Check(`"batteryTemp" >= -40 AND "batteryTemp" <= 120`)
@Check(`"soc" >= 0 AND "soc" <= 100`)
export class VehicleTelemetryHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  vehicleId: string;

  @Column('float', { nullable: false })
  kwhDeliveredDc: number;

  @Column('float', { nullable: false })
  batteryTemp: number;

  @Column('int', { nullable: false })
  soc: number;

  @Column({ type: 'timestamptz', nullable: false })
  timestamp: Date;
}
