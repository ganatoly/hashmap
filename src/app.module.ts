import { ConfigurationModule } from './configuration/configuration.module';
import { DBConfigService } from './configuration/services/dbconfig.service';
import { HashMapModule } from './hash-map/hash-map.module';
import { HealthModule } from './health/health.module';
import { Module } from '@nestjs/common';
import { TypeOrmConfigService } from './configuration/TypeOrmConfigService';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigurationModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigurationModule],
      inject: [DBConfigService],
      useClass: TypeOrmConfigService,
    }),
    HashMapModule,
    HealthModule,
  ],
})
export class AppModule {}
