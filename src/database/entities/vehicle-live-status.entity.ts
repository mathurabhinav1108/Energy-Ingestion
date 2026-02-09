import { Entity, Column, PrimaryColumn, Check } from 'typeorm';

@Entity('vehicle_live_status')
@Check(`"soc" >= 0 AND "soc" <= 100`)
@Check(`"lastKwhDeliveredDc" >= 0`)
export class VehicleLiveStatus {
  @PrimaryColumn()
  vehicleId: string;

  @Column('int', { nullable: false })
  soc: number;

  @Column('float', { nullable: false })
  batteryTemp: number;

  @Column('float', { nullable: false })
  lastKwhDeliveredDc: number;

  @Column({ type: 'timestamptz', nullable: false })
  updatedAt: Date;
}
