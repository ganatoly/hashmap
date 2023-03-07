import { AppConfigService } from './services/appconfig.service';
import { DBConfigService } from './services/dbconfig.service';
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(
    private appConfigService: AppConfigService,
    private dbConfigService: DBConfigService,
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    const conf: TypeOrmModuleOptions = {
      ...this.dbConfigService.typeORMConfiguration,
      autoLoadEntities: true,
      synchronize: this.appConfigService.isDevelopment,
    };

    return conf;
  }
}
