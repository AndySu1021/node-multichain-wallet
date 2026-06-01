import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

const ERC20_ABI = [
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
];

@Injectable()
export class EthereumService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EthereumService.name);
  private provider: ethers.WebSocketProvider;
  private masterNode: ethers.HDNodeWallet;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    // TODO: re-enable before going live
    // const wsUrl = this.configService.get<string>('ethereum.wsUrl') ?? 'ws://localhost:8546';
    // this.provider = new ethers.WebSocketProvider(wsUrl);
    // this.provider.on('error', (err) => {
    //   this.logger.error('WebSocket provider error', err);
    // });

    // const mnemonic = this.configService.get<string>('ethereum.masterMnemonic');
    // if (!mnemonic) throw new Error('WALLET_MASTER_MNEMONIC is not configured');
    // this.masterNode = ethers.HDNodeWallet.fromPhrase(mnemonic);
  }

  async onModuleDestroy() {
    await this.provider.destroy();
  }

  getProvider(): ethers.WebSocketProvider {
    return this.provider;
  }

  // BIP44: m/44'/60'/0'/0/{index}. Index must be globally unique across all wallets.
  deriveWallet(index: number): ethers.HDNodeWallet {
    return this.masterNode.derivePath(`m/44'/60'/0'/0/${index}`).connect(this.provider);
  }

  getErc20Contract(contractAddress: string): ethers.Contract {
    return new ethers.Contract(contractAddress, ERC20_ABI, this.provider);
  }

  async getEthBalance(address: string): Promise<string> {
    const balance = await this.provider.getBalance(address);
    return balance.toString();
  }

  async getErc20Balance(contractAddress: string, address: string): Promise<string> {
    const contract = this.getErc20Contract(contractAddress);
    const balance = await contract.balanceOf(address);
    return balance.toString();
  }

  async sendEth(
    signer: ethers.Wallet | ethers.HDNodeWallet,
    to: string,
    amountRaw: string,
  ): Promise<ethers.TransactionResponse> {
    return signer.sendTransaction({ to, value: BigInt(amountRaw) });
  }

  async sendErc20(
    signer: ethers.Wallet | ethers.HDNodeWallet,
    contractAddress: string,
    to: string,
    amountRaw: string,
  ): Promise<ethers.TransactionResponse> {
    const contract = new ethers.Contract(
      contractAddress,
      ['function transfer(address to, uint256 amount) returns (bool)'],
      signer,
    );
    return contract.transfer(to, BigInt(amountRaw));
  }
}