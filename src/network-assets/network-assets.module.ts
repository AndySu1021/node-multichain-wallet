import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NetworkAssetsService } from './network-assets.service';
import { NetworkAsset } from './entities/network-asset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NetworkAsset])],
  providers: [NetworkAssetsService],
  exports: [NetworkAssetsService],
})
export class NetworkAssetsModule {}