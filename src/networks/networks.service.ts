import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Network } from './entities/network.entity';

@Injectable()
export class NetworksService {
  constructor(
    @InjectRepository(Network)
    private readonly networkRepo: Repository<Network>,
  ) {}

  findAll(): Promise<Network[]> {
    return this.networkRepo.find({ where: { isActive: true } });
  }

  findOne(id: string): Promise<Network | null> {
    return this.networkRepo.findOne({ where: { id } });
  }
}