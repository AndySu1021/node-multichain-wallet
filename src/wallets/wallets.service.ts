import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { EthereumService } from '../ethereum/ethereum.service';
import { NetworkAssetsService } from '../network-assets/network-assets.service';
import { NetworksService } from '../networks/networks.service';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepo: Repository<Wallet>,
    private readonly ethereumService: EthereumService,
    private readonly networkAssetsService: NetworkAssetsService,
    private readonly networksService: NetworksService,
  ) {}

  async create(userId: string, networkId: string): Promise<Wallet> {
    const network = await this.networksService.findOne(networkId);
    if (!network) throw new NotFoundException('Network not found');
    if (!network.isActive) throw new BadRequestException('Network is not active');

    // Derivation index is unique per network; each network starts its own sequence from 0
    const derivationIndex = await this.walletRepo.count({ where: { networkId } });

    let address: string;
    if (network.symbol === 'ETH') {
      address = this.ethereumService.deriveWallet(derivationIndex).address;
    } else {
      throw new BadRequestException(`Address derivation for ${network.symbol} is not yet implemented`);
    }

    const wallet = this.walletRepo.create({ userId, networkId, address, derivationIndex });
    return this.walletRepo.save(wallet);
  }

  async findAllByUser(userId: string): Promise<Wallet[]> {
    return this.walletRepo.find({ where: { userId }, relations: { network: true } });
  }

  async findOne(id: string, userId: string): Promise<Wallet> {
    const wallet = await this.walletRepo.findOne({ where: { id, userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet;
  }

  async getBalances(walletId: string, userId: string) {
    const wallet = await this.findOne(walletId, userId);
    const networkAssets = await this.networkAssetsService.findByNetworkId(wallet.networkId);

    const balances = await Promise.all(
      networkAssets.map(async (na) => {
        const balanceRaw = na.contractAddress
          ? await this.ethereumService.getErc20Balance(na.contractAddress, wallet.address)
          : await this.ethereumService.getEthBalance(wallet.address);
        return { asset: { id: na.asset.id, symbol: na.asset.symbol, decimals: na.asset.decimals }, balanceRaw };
      }),
    );
    return { address: wallet.address, balances };
  }

  async getDecryptedSigner(walletId: string, userId: string) {
    const wallet = await this.findOne(walletId, userId);
    return this.ethereumService.deriveWallet(wallet.derivationIndex);
  }
}