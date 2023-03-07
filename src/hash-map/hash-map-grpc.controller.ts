import { Controller, NotFoundException, UseInterceptors } from '@nestjs/common';
import { GetHashMapDto } from './dto/get-hash-map.dto';
import { GrpcMethod } from '@nestjs/microservices';
import { HashMapDto } from './dto/hash-map.dto';
import { HashMapService } from './hash-map.service';
import { LoggingInterceptor } from 'src/monitoring/logging.interceptor';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { PromMetricsInterceptor } from 'src/monitoring/prom-metrics.interceptor';
import { PutHashMapDto } from './dto/put-hash-map.dto';

@Controller('hashmap')
export class HashMapGRPCController {
  constructor(private readonly hashMapService: HashMapService) {}

  @GrpcMethod('HashMapService', 'putEntry')
  @UseInterceptors(PromMetricsInterceptor)
  @UseInterceptors(LoggingInterceptor)
  async putEntry(
    putHashMapDto: PutHashMapDto,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<HashMapDto> {
    return await this.hashMapService.putEntry(putHashMapDto);
  }

  @GrpcMethod('HashMapService', 'getEntry')
  @UseInterceptors(PromMetricsInterceptor)
  @UseInterceptors(LoggingInterceptor)
  async getEntry(
    getHashMapDto: GetHashMapDto,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<HashMapDto> {
    const entry = await this.hashMapService.getEntry(getHashMapDto.key);
    if (!entry) throw new NotFoundException();
    return entry;
  }
}
