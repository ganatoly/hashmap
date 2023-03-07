import { AppConfigService } from './services/appconfig.service';
import { ConfigModule } from '@nestjs/config';
import { DBConfigService } from './services/dbconfig.service';
import { Module } from '@nestjs/common';
import appConfiguration from './config/app.configuration';
import databaseConfiguration from './config/database.configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfiguration, databaseConfiguration],
    }),
  ],
  providers: [AppConfigService, DBConfigService],
  exports: [AppConfigService, DBConfigService],
})
export class ConfigurationModule {}
