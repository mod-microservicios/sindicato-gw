import { IsEmail, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class CreateUserDto {
    @ApiProperty({required: true, example: '12345678', description: 'Cédula de identidad del usuario'})
    @MinLength(4)
    ci: string;
    @ApiProperty({required: true, example: 'user@example.com', description: 'Correo electrónico del usuario'})
    @IsEmail({},{message: 'El correo no es válido'})
    email: string;
    @ApiProperty({required: true, example: 'hola123', description: 'Contraseña del usuario'})
    @MinLength(4)
    password: string;
    @ApiProperty({required: true, example: 'Juan', description: 'Nombre del usuario'})
    @MinLength(2,{message: 'El nombre debe tener al menos 2 caracteres'})
    name: string;
    @ApiProperty({required: true, example: 'Perez', description: 'Apellido del usuario'})
    @MinLength(2,{message: 'El apellido debe tener al menos 2 caracteres'})
    lastName: string;

    @ApiProperty({required: true, example: 'Gomez', description: 'Segundo apellido del usuario'})
    @MinLength(2,{message: 'El segundo apellido debe tener al menos 2 caracteres'})
    secondLastName: string;
    @ApiProperty({required: true, example: '71234567', description: 'Número de celular del usuario'})
    @MinLength(6,{message: 'El celular debe tener al menos 6 digitos'})
    cellphone: string;
    @ApiProperty({required: false, example: 'Ingeniero', description: 'Profesión del usuario'})
    profession?: string;
    @ApiProperty({required: true, example: 'EMPLEADO', description: 'Tipo de usuario (ADMIN, EMPLEADO, CHOFER)'})
    type: string;

    createdAt?: Date;
    updatedAt?: Date;

}

