import { AppConfigService } from './configuration/services/appconfig.service';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HashMapModule } from './hash-map/hash-map.module';
import { HealthModule } from './health/health.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { join } from 'path';

function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('HashMap')
    .setDescription('HashMap service')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    include: [HashMapModule, HealthModule],
  });
  SwaggerModule.setup('swagger', app, document);
}

function createGRPCMicroservice(app: INestApplication) {
  const grpcMicroservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'hashmap',
      protoPath: join(__dirname, 'proto/hashmap/hashmap.proto'),
    },
  });
  return grpcMicroservice;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const appConfigService = app.get(AppConfigService);
  createGRPCMicroservice(app);

  setupSwagger(app);

  await app.startAllMicroservices();
  await app.listen(appConfigService.port);
}
bootstrap();
