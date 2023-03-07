import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DBConfigService {
  constructor(private configService: ConfigService) {}

  get host(): string {
    return this.configService.get('database.host');
  }

  get port(): number {
    return this.configService.get('database.port');
  }

  get username(): string {
    return this.configService.get('database.username');
  }

  get password(): string {
    return this.configService.get('database.password');
  }

  get database(): string {
    return this.configService.get('database.database');
  }

  get typeORMConfiguration(): Partial<DataSourceOptions> {
    return {
      type: 'postgres',
      host: this.host,
      port: this.port,
      username: this.username,
      password: this.password,
      database: this.database,
      synchronize: false,
      logging: false,
    };
  }
}
