import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NetworkAsset } from './entities/network-asset.entity';

@Injectable()
export class NetworkAssetsService {
  constructor(
    @InjectRepository(NetworkAsset)
    private readonly repo: Repository<NetworkAsset>,
  ) {}

  findByNetworkId(networkId: string): Promise<NetworkAsset[]> {
    return this.repo.find({
      where: { networkId, isActive: true },
      relations: { asset: true },
    });
  }
}