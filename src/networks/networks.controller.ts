import { Controller, Get } from '@nestjs/common';
import { NetworksService } from './networks.service';

@Controller('networks')
export class NetworksController {
  constructor(private readonly networksService: NetworksService) {}

  @Get()
  findAll() {
    return this.networksService.findAll();
  }
}