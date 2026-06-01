import { IsString, IsUUID, Matches } from 'class-validator';

export class CreateWithdrawalDto {
  @IsUUID()
  walletId: string;

  @IsUUID()
  assetId: string;

  @IsString()
  toAddress: string;

  @IsString()
  @Matches(/^\d+$/, { message: 'amountRaw must be a positive integer string (wei/smallest unit)' })
  amountRaw: string;
}