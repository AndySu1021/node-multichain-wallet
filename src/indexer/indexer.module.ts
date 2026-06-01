import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndexerService } from './indexer.service';
import { Wallet } from '../wallets/entities/wallet.entity';
import { EthereumModule } from '../ethereum/ethereum.module';
import { NetworkAssetsModule } from '../network-assets/network-assets.module';
import { NetworksModule } from '../networks/networks.module';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet]),
    EthereumModule,
    NetworkAssetsModule,
    NetworksModule,
    TransactionsModule,
  ],
  providers: [IndexerService],
})
export class IndexerModule {}