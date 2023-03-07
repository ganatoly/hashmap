import { ConfigurationModule } from 'src/configuration/configuration.module';
import { HealthController } from './health.controller';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [ConfigurationModule, TerminusModule],
  controllers: [HealthController],
})
export class HealthModule {}
