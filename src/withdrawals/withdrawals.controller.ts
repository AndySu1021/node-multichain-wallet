import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { WithdrawalsService } from './withdrawals.service';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('withdrawals')
export class WithdrawalsController {
  constructor(private readonly withdrawalsService: WithdrawalsService) {}

  @Post()
  create(@Body() dto: CreateWithdrawalDto, @Request() req) {
    return this.withdrawalsService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Request() req) {
    return this.withdrawalsService.findAllByUser(req.user.id);
  }
}