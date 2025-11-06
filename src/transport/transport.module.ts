import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

const clientsModule = ClientsModule.registerAsync([
  {
    name: 'MS_AUTH',
    useFactory: (configService: ConfigService) => ({
      transport: Transport.TCP,
      options: {
        host: configService.get<string>('MS_AUTH_HOST', '127.0.0.1'),
        port: configService.get<number>('MS_AUTH_PORT', 3001),
      },
    }),
    inject: [ConfigService],
  },
  {
    name: 'MS_ACTIVOS',
    useFactory: (configService: ConfigService) => ({
      transport: Transport.TCP,
      options: {
        host: configService.get<string>('MS_ACTIVOS_HOST', '127.0.0.1'),
        port: configService.get<number>('MS_ACTIVOS_PORT', 3002),
      },
    }),
    inject: [ConfigService],
  },
]);

@Module({
  imports: [clientsModule],
  controllers: [],
  providers: [],
  exports: [clientsModule],
})
export class TransportModule {}
