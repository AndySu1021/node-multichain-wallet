import { registerAs } from '@nestjs/config';

export default registerAs('kms', () => ({
  region: process.env.AWS_REGION || 'ap-northeast-1',
  keyId: process.env.AWS_KMS_KEY_ID,
}));