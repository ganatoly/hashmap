import { Module } from '@nestjs/common';
import {
  PrometheusModule,
  makeCounterProvider,
  makeHistogramProvider,
} from '@willsoto/nestjs-prometheus';

const metricProviders = [
  makeCounterProvider({
    name: 'hm_request_count',
    help: 'Total count all requests',
    labelNames: ['transport', 'endpoint', 'method'],
  }),
  makeHistogramProvider({
    name: 'hm_response_ellapsed_time',
    help: 'Ellapsed time',
    labelNames: ['transport', 'endpoint', 'method'],
  }),
];

@Module({
  imports: [
    PrometheusModule.register({
      defaultLabels: {
        app: 'hashmap',
      },
    }),
  ],
  providers: [...metricProviders],
  exports: [...metricProviders],
})
export class MonitoringModule {}
