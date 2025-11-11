import { MinLength, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
export class CreateVehiculoDto {
  @ApiProperty({required: true, example: '12345678', description: 'ID del usuario'})
  @IsString()
  @MinLength(3)
  idUser: string;

  @ApiProperty({required: true, example: 'ABC123', description: 'Placa del vehiculo'})
  @IsString()
  @MinLength(3)
  placa: string;

  @ApiProperty({required: true, example: 'Modelo', description: 'Modelo del vehiculo'})
  @IsString()
  @MinLength(3)
  modelo: string;

  @ApiProperty({required: true, example: 'Marca', description: 'Marca del vehiculo'})
  @IsString()
  @MinLength(3)
  marca: string;

  @ApiProperty({required: true, example: 2025, description: 'Año del vehiculo'})
  @IsNumber()
  anio: number;

  @ApiProperty({required: true, example: 5, description: 'Capacidad del vehiculo'})
  @IsNumber()
  capacidad: number;
}

