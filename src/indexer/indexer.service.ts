import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ethers } from 'ethers';
import { EthereumService } from '../ethereum/ethereum.service';
import { AssetsService } from '../assets/assets.service';
import { TransactionsService } from '../transactions/transactions.service';
import { Wallet } from '../wallets/entities/wallet.entity';
import { TransactionStatus } from '../transactions/entities/transaction.entity';

@Injectable()
export class IndexerService implements OnModuleInit {
  private readonly logger = new Logger(IndexerService.name);

  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepo: Repository<Wallet>,
    private readonly ethereumService: EthereumService,
    private readonly assetsService: AssetsService,
    private readonly transactionsService: TransactionsService,
  ) {}

  async onModuleInit() {
    // TODO: re-enable before going live
    // await this.startListening();
  }

  private async startListening() {
    const provider = this.ethereumService.getProvider();

    provider.on('block', async (blockNumber: number) => {
      try {
        await this.processBlock(blockNumber);
      } catch (err) {
        this.logger.error(`Error processing block ${blockNumber}`, err);
      }
    });

    this.logger.log('Indexer started, listening for new blocks');
  }

  private async processBlock(blockNumber: number) {
    const [block, assets, wallets] = await Promise.all([
      this.ethereumService.getProvider().getBlock(blockNumber, true),
      this.assetsService.findActive(),
      this.walletRepo.find(),
    ]);

    if (!block || !block.transactions.length) return;

    const watchedAddresses = new Set(wallets.map((w) => w.address.toLowerCase()));
    const ethAsset = assets.find((a) => !a.contractAddress);
    const erc20Assets = assets.filter((a) => a.contractAddress);

    // Process ETH transfers
    if (ethAsset) {
      for (const tx of block.transactions as unknown as ethers.TransactionResponse[]) {
        if (!tx.to) continue;
        const isIncoming = watchedAddresses.has(tx.to.toLowerCase());
        const isOutgoing = watchedAddresses.has(tx.from.toLowerCase());
        if (!isIncoming && !isOutgoing) continue;

        await this.transactionsService.upsert({
          txHash: tx.hash,
          blockNumber,
          fromAddress: tx.from,
          toAddress: tx.to,
          assetId: ethAsset.id,
          amountRaw: tx.value.toString(),
          status: TransactionStatus.CONFIRMED,
        });
      }
    }

    // Process ERC20 Transfer events
    for (const asset of erc20Assets) {
      const contract = this.ethereumService.getErc20Contract(asset.contractAddress);
      const filter = contract.filters.Transfer();
      const logs = await contract.queryFilter(filter, blockNumber, blockNumber);

      for (const log of logs) {
        const event = log as ethers.EventLog;
        const from: string = event.args[0];
        const to: string = event.args[1];
        const value: bigint = event.args[2];

        if (!watchedAddresses.has(from.toLowerCase()) && !watchedAddresses.has(to.toLowerCase())) continue;

        await this.transactionsService.upsert({
          txHash: event.transactionHash,
          blockNumber,
          fromAddress: from,
          toAddress: to,
          assetId: asset.id,
          amountRaw: value.toString(),
          status: TransactionStatus.CONFIRMED,
        });
      }
    }
  }
}