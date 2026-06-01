import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { Network } from '../../networks/entities/network.entity';
import { Asset } from '../../assets/entities/asset.entity';

@Entity('network_asset')
export class NetworkAsset {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ name: 'network_id', type: 'bigint' })
  networkId: string;

  @Column({ name: 'asset_id', type: 'bigint' })
  assetId: string;

  @Column({ name: 'contract_address', nullable: true })
  contractAddress: string | null;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Network)
  @JoinColumn({ name: 'network_id' })
  network: Network;

  @ManyToOne(() => Asset)
  @JoinColumn({ name: 'asset_id' })
  asset: Asset;
}