import { PartialType } from '@nestjs/mapped-types';
import { CreateVehiculoDto } from './create-vehiculo.dto';
import { IsString } from 'class-validator';

export class UpdateVehiculoDto extends PartialType(CreateVehiculoDto) {
  @IsString()
  id: string;
}

