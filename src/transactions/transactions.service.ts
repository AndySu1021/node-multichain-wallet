import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionStatus } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly txRepo: Repository<Transaction>,
  ) {}

  async upsert(data: {
    txHash: string;
    blockNumber: number;
    fromAddress: string;
    toAddress: string;
    assetId: string;
    amountRaw: string;
    status: TransactionStatus;
  }): Promise<void> {
    await this.txRepo.upsert(data, ['txHash']);
  }

  findByAddress(address: string): Promise<Transaction[]> {
    return this.txRepo.find({
      where: [{ fromAddress: address }, { toAddress: address }],
      relations: { asset: true },
      order: { createdAt: 'DESC' },
    });
  }

  findByTxHash(txHash: string): Promise<Transaction | null> {
    return this.txRepo.findOne({ where: { txHash }, relations: { asset: true } });
  }
}
