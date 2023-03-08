import {
  Controller,
  InternalServerErrorException,
  NotFoundException,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GRPCStructJSONTransformInterceptor } from '../helpers/grpc-struct-json-transform.iterceptor';
import { GetHashMapDto } from './dto/get-hash-map.dto';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { HashMapDto } from './dto/hash-map.dto';
import { HashMapService } from './hash-map.service';
import { LoggingInterceptor } from 'src/monitoring/logging.interceptor';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { PromMetricsInterceptor } from 'src/monitoring/prom-metrics.interceptor';
import { PutHashMapDto } from './dto/put-hash-map.dto';

@UsePipes(new ValidationPipe())
@Controller('hashmap')
export class HashMapGRPCController {
  constructor(private readonly hashMapService: HashMapService) {}

  @GrpcMethod('HashMapService', 'putEntry')
  @UseInterceptors(PromMetricsInterceptor)
  @UseInterceptors(LoggingInterceptor)
  @UseInterceptors(new GRPCStructJSONTransformInterceptor('value', 'value'))
  async putEntry(
    putHashMapDto: PutHashMapDto,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<HashMapDto> {
    const record = await this.hashMapService.putEntry(putHashMapDto);
    if (!record) throw new RpcException('InternalServerError');
    return new HashMapDto({ key: record.key, value: record.value });
  }

  @GrpcMethod('HashMapService', 'getEntry')
  @UseInterceptors(PromMetricsInterceptor)
  @UseInterceptors(LoggingInterceptor)
  @UseInterceptors(new GRPCStructJSONTransformInterceptor(null, 'value'))
  async getEntry(
    getHashMapDto: GetHashMapDto,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<HashMapDto> {
    const record = await this.hashMapService.getEntry(getHashMapDto.key);
    if (!record) throw new RpcException('NotFound');
    return new HashMapDto({ key: record.key, value: record.value });
  }
}
