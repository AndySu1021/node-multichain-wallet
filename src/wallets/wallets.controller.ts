import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateWalletDto } from './dto/create-wallet.dto';

@UseGuards(JwtAuthGuard)
@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post()
  create(@Body() dto: CreateWalletDto, @Request() req) {
    return this.walletsService.create(req.user.id, dto.networkId);
  }

  @Get()
  findAll(@Request() req) {
    return this.walletsService.findAllByUser(req.user.id);
  }

  @Get(':id/balances')
  getBalances(@Param('id') id: string, @Request() req) {
    return this.walletsService.getBalances(id, req.user.id);
  }
}