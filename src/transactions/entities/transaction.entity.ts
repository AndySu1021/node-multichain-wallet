import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn, Index,
} from 'typeorm';
import { Asset } from '../../assets/entities/asset.entity';

export enum TransactionStatus {
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ name: 'tx_hash' })
  txHash: string;

  @Column({ name: 'block_number' })
  blockNumber: number;

  @Column({ name: 'from_address' })
  fromAddress: string;

  @Column({ name: 'to_address' })
  toAddress: string;

  @Column({ name: 'asset_id' })
  assetId: string;

  @Column({ name: 'amount_raw', type: 'numeric', precision: 78, scale: 0 })
  amountRaw: string;

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.CONFIRMED })
  status: TransactionStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Asset)
  @JoinColumn({ name: 'assetId' })
  asset: Asset;
}