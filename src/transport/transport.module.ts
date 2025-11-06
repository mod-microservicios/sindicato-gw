import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

const clientsModule = ClientsModule.register([
  {
    name: 'MS_AUTH',
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 3001,
    },
  },
]);

@Module({
  imports: [clientsModule],
  controllers: [],
  providers: [],
  exports: [clientsModule],
})
export class TransportModule {}
