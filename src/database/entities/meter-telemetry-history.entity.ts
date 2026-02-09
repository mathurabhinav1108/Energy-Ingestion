import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  Check,
} from 'typeorm';

@Entity('meter_telemetry_history')
@Index(['meterId', 'timestamp'])
@Check(`"kwhConsumedAc" >= 0`)
@Check(`"voltage" > 0 AND "voltage" < 1000`)
export class MeterTelemetryHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  meterId: string;

  @Column('float', { nullable: false })
  kwhConsumedAc: number;

  @Column('float', { nullable: false })
  voltage: number;

  @Column({ type: 'timestamptz', nullable: false })
  timestamp: Date;
}
