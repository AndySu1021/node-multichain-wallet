import { registerAs } from '@nestjs/config';

export default registerAs('ethereum', () => ({
  wsUrl: process.env.ETH_WS_URL || 'ws://localhost:8546',
  masterMnemonic: process.env.WALLET_MASTER_MNEMONIC,
}));