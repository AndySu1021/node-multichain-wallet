import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { Wallet } from './entities/wallet.entity';
import { EthereumModule } from '../ethereum/ethereum.module';
import { NetworkAssetsModule } from '../network-assets/network-assets.module';
import { NetworksModule } from '../networks/networks.module';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet]), EthereumModule, NetworkAssetsModule, NetworksModule],
  controllers: [WalletsController],
  providers: [WalletsService],
  exports: [WalletsService],
})
export class WalletsModule {}