import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KMSClient, EncryptCommand, DecryptCommand } from '@aws-sdk/client-kms';

@Injectable()
export class KmsService implements OnModuleInit {
  private client: KMSClient;
  private keyId: string;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.client = new KMSClient({
      region: this.configService.get<string>('kms.region'),
    });
    this.keyId = this.configService.get<string>('kms.keyId') ?? '';
  }

  async encrypt(plaintext: string): Promise<string> {
    const command = new EncryptCommand({
      KeyId: this.keyId,
      Plaintext: Buffer.from(plaintext),
    });
    const response = await this.client.send(command);
    return Buffer.from(response.CiphertextBlob!).toString('base64');
  }

  async decrypt(ciphertext: string): Promise<string> {
    const command = new DecryptCommand({
      CiphertextBlob: Buffer.from(ciphertext, 'base64'),
    });
    const response = await this.client.send(command);
    return Buffer.from(response.Plaintext!).toString('utf-8');
  }
}