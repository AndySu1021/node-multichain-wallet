import { IsInt, Min } from 'class-validator';

export class CreateWalletDto {
  @IsInt()
  @Min(1)
  networkId: number;
}