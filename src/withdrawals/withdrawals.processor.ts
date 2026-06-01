import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from 'bullmq';
import { Withdrawal, WithdrawalStatus } from './entities/withdrawal.entity';
import { WalletsService } from '../wallets/wallets.service';
import { AssetsService } from '../assets/assets.service';
import { EthereumService } from '../ethereum/ethereum.service';

export const WITHDRAWAL_QUEUE = 'withdrawals';

@Processor(WITHDRAWAL_QUEUE)
export class WithdrawalsProcessor extends WorkerHost {
  private readonly logger = new Logger(WithdrawalsProcessor.name);

  constructor(
    @InjectRepository(Withdrawal)
    private readonly withdrawalRepo: Repository<Withdrawal>,
    private readonly walletsService: WalletsService,
    private readonly assetsService: AssetsService,
    private readonly ethereumService: EthereumService,
  ) {
    super();
  }

  async process(job: Job<{ withdrawalId: string }>): Promise<void> {
    const { withdrawalId } = job.data;
    const withdrawal = await this.withdrawalRepo.findOne({ where: { id: withdrawalId } });
    if (!withdrawal) return;

    try {
      const [signer, asset] = await Promise.all([
        this.walletsService.getDecryptedSigner(withdrawal.walletId, withdrawal.userId),
        this.assetsService.findById(withdrawal.assetId),
      ]);

      let tx: Awaited<ReturnType<typeof this.ethereumService.sendEth>>;

      if (!asset.contractAddress) {
        tx = await this.ethereumService.sendEth(signer, withdrawal.toAddress, withdrawal.amountRaw);
      } else {
        tx = await this.ethereumService.sendErc20(
          signer,
          asset.contractAddress,
          withdrawal.toAddress,
          withdrawal.amountRaw,
        );
      }

      await this.withdrawalRepo.update(withdrawalId, {
        txHash: tx.hash,
        status: WithdrawalStatus.BROADCASTING,
      });

      this.logger.log(`Withdrawal ${withdrawalId} broadcasted: ${tx.hash}`);

      await tx.wait(1);

      await this.withdrawalRepo.update(withdrawalId, { status: WithdrawalStatus.CONFIRMED });
      this.logger.log(`Withdrawal ${withdrawalId} confirmed`);
    } catch (err) {
      this.logger.error(`Withdrawal ${withdrawalId} failed`, err);
      await this.withdrawalRepo.update(withdrawalId, {
        status: WithdrawalStatus.FAILED,
        errorMessage: err.message,
      });
    }
  }
}