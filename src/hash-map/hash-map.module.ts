import { HashMap } from './entities/hash-map.entity';
import { HashMapGRPCController } from './hash-map-grpc.controller';
import { HashMapHTTPController } from './hash-map-http.controller';
import { HashMapService } from './hash-map.service';
import { Module } from '@nestjs/common';
import { MonitoringModule } from 'src/monitoring/monitoring.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [MonitoringModule, TypeOrmModule.forFeature([HashMap])],
  controllers: [HashMapHTTPController, HashMapGRPCController],
  providers: [HashMapService],
})
export class HashMapModule {}
