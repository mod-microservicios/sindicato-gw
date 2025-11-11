import { Module } from '@nestjs/common';
import { VehiculosService } from './vehiculos.service';
import { VehiculosController } from './vehiculos.controller';
import { TransportModule } from 'src/transport/transport.module';
import { CircuitBreakerModule } from '../../common/circuit-breaker.module';

@Module({
  imports: [TransportModule, CircuitBreakerModule],
  controllers: [VehiculosController],
  providers: [VehiculosService],
})
export class VehiculosModule {}

