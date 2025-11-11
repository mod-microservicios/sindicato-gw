import { Inject, Injectable } from '@nestjs/common';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, retry, catchError, throwError, timeout, timer } from 'rxjs';
import { CircuitBreakerService } from '../../common/circuit-breaker.service';

const vehiculoPattern = {
  create: 'createVehiculo',
  findAll: 'findAllVehiculos',
  findOne: 'findOneVehiculo',
  update: 'updateVehiculo',
  remove: 'removeVehiculo',
};

@Injectable()
export class VehiculosService {
  constructor(
    @Inject('MS_ACTIVOS') private client: ClientProxy,
    private circuitBreaker: CircuitBreakerService,
  ) {}
  // async create(createVehiculoDto: CreateVehiculoDto) {
  //   return await firstValueFrom(this.client.send(vehiculoPattern.create, createVehiculoDto));
  // }
  async create(createVehiculoDto: CreateVehiculoDto) {
    return await this.circuitBreaker.execute(
      () =>
        firstValueFrom(
          this.client.send(vehiculoPattern.create, createVehiculoDto).pipe(
            timeout(5000),
            retry({
              count: 3,
              delay: (error, retryCount) => {
                console.log(`Retry attempt ${retryCount} for createVehiculo`);
                return timer(1000);
              },
            }),
            catchError((error) => {
              console.error('Error creating vehiculo:', error);
              return throwError(() => error);
            }),
          ),
        ),
      'createVehiculo',
    );
  }

  async findAll() {
    return await this.circuitBreaker.execute(
      () =>
        firstValueFrom(
          this.client.send(vehiculoPattern.findAll, {}).pipe(
            timeout(5000),
            retry({
              count: 3,
              delay: (error, retryCount) => {
                console.log(`Retry attempt ${retryCount} for findAllVehiculos`);
                return timer(1000);
              },
            }),
            catchError((error) => {
              console.error('Error finding all vehiculos:', error);
              return throwError(() => error);
            }),
          ),
        ),
      'findAllVehiculos',
    );
  }

  async findOne(id: string) {
    return await this.circuitBreaker.execute(
      () =>
        firstValueFrom(
          this.client.send(vehiculoPattern.findOne, id).pipe(
            timeout(5000),
            retry({
              count: 3,
              delay: (error, retryCount) => {
                console.log(`Retry attempt ${retryCount} for findOneVehiculo`);
                return timer(1000);
              },
            }),
            catchError((error) => {
              console.error('Error finding vehiculo:', error);
              return throwError(() => error);
            }),
          ),
        ),
      'findOneVehiculo',
    );
  }

  async update(id: string, updateVehiculoDto: UpdateVehiculoDto) {
    const { id: _, ...data } = updateVehiculoDto;
    return await this.circuitBreaker.execute(
      () =>
        firstValueFrom(
          this.client.send(vehiculoPattern.update, { id, ...data }).pipe(
            timeout(5000),
            retry({
              count: 3,
              delay: (error, retryCount) => {
                console.log(`Retry attempt ${retryCount} for updateVehiculo`);
                return timer(1000);
              },
            }),
            catchError((error) => {
              console.error('Error updating vehiculo:', error);
              return throwError(() => error);
            }),
          ),
        ),
      'updateVehiculo',
    );
  }

  async remove(id: string) {
    return await this.circuitBreaker.execute(
      () =>
        firstValueFrom(
          this.client.send(vehiculoPattern.remove, id).pipe(
            timeout(5000),
            retry({
              count: 3,
              delay: (error, retryCount) => {
                console.log(`Retry attempt ${retryCount} for removeVehiculo`);
                return timer(1000);
              },
            }),
            catchError((error) => {
              console.error('Error removing vehiculo:', error);
              return throwError(() => error);
            }),
          ),
        ),
      'removeVehiculo',
    );
  }
}

