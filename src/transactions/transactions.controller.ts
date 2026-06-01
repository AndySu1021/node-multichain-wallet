import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { WalletsService } from '../wallets/wallets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('wallets/:walletId/transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly walletsService: WalletsService,
  ) {}

  @Get()
  async findAll(@Param('walletId') walletId: string, @Request() req) {
    const wallet = await this.walletsService.findOne(walletId, req.user.id);
    return this.transactionsService.findByAddress(wallet.address);
  }
}