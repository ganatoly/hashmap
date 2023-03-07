import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { HashMapDto } from './dto/hash-map.dto';
import { HashMapService } from './hash-map.service';
import { LoggingInterceptor } from 'src/monitoring/logging.interceptor';
import { PromMetricsInterceptor } from 'src/monitoring/prom-metrics.interceptor';
import { PutHashMapDto } from './dto/put-hash-map.dto';

@ApiTags('hashmap')
@Controller('hashmap')
export class HashMapHTTPController {
  constructor(private readonly hashMapService: HashMapService) {}

  @Post()
  // OpenAPI
  @ApiOperation({ summary: 'Put HashMap entry' })
  // @ApiCreatedResponse({ type: ReportResponseDto })
  // Interceptors
  @UseInterceptors(PromMetricsInterceptor)
  @UseInterceptors(LoggingInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  async putEntry(@Body() putHashMapDto: PutHashMapDto) {
    const record = await this.hashMapService.putEntry(putHashMapDto);
    if (!record) throw new InternalServerErrorException();
    return new HashMapDto({ key: record.key, value: record.value });
  }

  @Get(':key')
  // OpenAPI
  @ApiOperation({ summary: 'Get HashMap entry' })
  @ApiOkResponse({ type: HashMapDto })
  @ApiNotFoundResponse()
  // Interceptors
  @UseInterceptors(PromMetricsInterceptor)
  @UseInterceptors(LoggingInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  async getEntry(@Param('key') key: string) {
    const record = await this.hashMapService.getEntry(key);
    if (!record) throw new NotFoundException();
    return new HashMapDto({ key: record.key, value: record.value });
  }
}
