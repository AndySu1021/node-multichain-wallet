import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Withdrawal } from './entities/withdrawal.entity';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { WITHDRAWAL_QUEUE } from './withdrawals.processor';

@Injectable()
export class WithdrawalsService {
  constructor(
    @InjectRepository(Withdrawal)
    private readonly withdrawalRepo: Repository<Withdrawal>,
    @InjectQueue(WITHDRAWAL_QUEUE)
    private readonly withdrawalQueue: Queue,
  ) {}

  async create(userId: string, dto: CreateWithdrawalDto): Promise<Withdrawal> {
    const withdrawal = await this.withdrawalRepo.save(
      this.withdrawalRepo.create({
        userId,
        walletId: dto.walletId,
        assetId: dto.assetId,
        toAddress: dto.toAddress,
        amountRaw: dto.amountRaw,
      }),
    );

    await this.withdrawalQueue.add('process', { withdrawalId: withdrawal.id });
    return withdrawal;
  }

  findAllByUser(userId: string): Promise<Withdrawal[]> {
    return this.withdrawalRepo.find({
      where: { userId },
      relations: { asset: true, wallet: true },
      order: { createdAt: 'DESC' },
    });
  }
}