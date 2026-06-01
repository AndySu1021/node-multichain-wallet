import { Transform } from 'class-transformer';
import { IsNumberString } from 'class-validator';

export class CreateWalletDto {
  @Transform(({ value }) => String(value))
  @IsNumberString()
  networkId: string;
}