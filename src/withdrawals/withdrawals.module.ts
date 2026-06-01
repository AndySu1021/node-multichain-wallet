import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { WithdrawalsService } from './withdrawals.service';
import { WithdrawalsController } from './withdrawals.controller';
import { WithdrawalsProcessor, WITHDRAWAL_QUEUE } from './withdrawals.processor';
import { Withdrawal } from './entities/withdrawal.entity';
import { WalletsModule } from '../wallets/wallets.module';
import { AssetsModule } from '../assets/assets.module';
import { EthereumModule } from '../ethereum/ethereum.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Withdrawal]),
    BullModule.registerQueue({ name: WITHDRAWAL_QUEUE }),
    WalletsModule,
    AssetsModule,
    EthereumModule,
  ],
  controllers: [WithdrawalsController],
  providers: [WithdrawalsService, WithdrawalsProcessor],
})
export class WithdrawalsModule {}