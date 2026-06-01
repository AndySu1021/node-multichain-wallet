import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndexerService } from './indexer.service';
import { Wallet } from '../wallets/entities/wallet.entity';
import { EthereumModule } from '../ethereum/ethereum.module';
import { AssetsModule } from '../assets/assets.module';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet]),
    EthereumModule,
    AssetsModule,
    TransactionsModule,
  ],
  providers: [IndexerService],
})
export class IndexerModule {}