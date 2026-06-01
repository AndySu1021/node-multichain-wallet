import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

@Entity('asset')
export class Asset {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ unique: true })
  symbol: string;

  @Column()
  name: string;

  @Column({ name: 'contract_address', nullable: true, unique: true })
  contractAddress: string;

  @Column()
  decimals: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}