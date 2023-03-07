import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get port(): number {
    return this.configService.get('app.appPort');
  }
  get isProduction(): boolean {
    return (
      (this.configService.get('app.nodeEnv') || '').toLowerCase() ===
      'production'
    );
  }
  get isDevelopment(): boolean {
    return (
      (this.configService.get('app.nodeEnv') || '').toLowerCase() ===
      'development'
    );
  }
}
