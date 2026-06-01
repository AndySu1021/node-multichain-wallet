import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { Wallet } from '../../wallets/entities/wallet.entity';
import { NetworkAsset } from '../../network-assets/entities/network-asset.entity';

@Entity('user_asset_balance')
export class UserAssetBalance {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ name: 'wallet_id', type: 'bigint' })
  walletId: string;

  @Column({ name: 'network_asset_id', type: 'bigint' })
  networkAssetId: string;

  @Column({ name: 'amount_raw', type: 'numeric', precision: 78, scale: 0, default: '0' })
  amountRaw: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Wallet)
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;

  @ManyToOne(() => NetworkAsset)
  @JoinColumn({ name: 'network_asset_id' })
  networkAsset: NetworkAsset;
}