import { Entity, Column, PrimaryColumn, Check } from 'typeorm';

@Entity('meter_live_status')
@Check(`"lastKwhConsumedAc" >= 0`)
@Check(`"voltage" > 0 AND "voltage" < 1000`)
export class MeterLiveStatus {
  @PrimaryColumn()
  meterId: string;

  @Column('float', { nullable: false })
  voltage: number;

  @Column('float', { nullable: false })
  lastKwhConsumedAc: number;

  @Column({ type: 'timestamptz', nullable: false })
  updatedAt: Date;
}