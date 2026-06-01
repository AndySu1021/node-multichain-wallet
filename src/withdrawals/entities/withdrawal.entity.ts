import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Wallet } from '../../wallets/entities/wallet.entity';
import { Asset } from '../../assets/entities/asset.entity';

export enum WithdrawalStatus {
  PENDING = 'pending',
  BROADCASTING = 'broadcasting',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
}

@Entity('withdrawals')
export class Withdrawal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'wallet_id' })
  walletId: string;

  @Column({ name: 'asset_id' })
  assetId: string;

  @Column({ name: 'to_address' })
  toAddress: string;

  @Column({ name: 'amount_raw', type: 'numeric', precision: 78, scale: 0 })
  amountRaw: string;

  @Column({ name: 'tx_hash', nullable: true })
  txHash: string;

  @Column({ type: 'enum', enum: WithdrawalStatus, default: WithdrawalStatus.PENDING })
  status: WithdrawalStatus;

  @Column({ name: 'error_message', nullable: true, type: 'text' })
  errorMessage: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.withdrawals)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Wallet)
  @JoinColumn({ name: 'walletId' })
  wallet: Wallet;

  @ManyToOne(() => Asset)
  @JoinColumn({ name: 'assetId' })
  asset: Asset;
}