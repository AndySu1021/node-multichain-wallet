import { IsNumberString, IsString, Matches } from 'class-validator';

export class CreateWithdrawalDto {
  @IsNumberString()
  walletId: string;

  @IsNumberString()
  assetId: string;

  @IsString()
  toAddress: string;

  @IsString()
  @Matches(/^\d+$/, { message: 'amountRaw must be a positive integer string (wei/smallest unit)' })
  amountRaw: string;
}