import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString()
  @MaxLength(100)
  name: string;

  @IsNotEmpty({ message: 'El apellido es requerido' })
  @IsString()
  @MaxLength(100)
  lastName: string;

  @IsNotEmpty({ message: 'El email es requerido' })
  @IsEmail({}, { message: 'Email no válido' })
  email: string;


  @IsString()
  @Matches(/^\d{7,15}$/, {
    message: 'El CUIT debe contener entre 7 y 15 dígitos',
  })
  cuit?: string;

  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsNotEmpty({ message: 'El número de documento es requerido' })
  @IsString()
  @Matches(/^\d{7,15}$/, {
    message: 'El documento debe contener entre 7 y 15 dígitos',
  })
  documentNumber: string;
}
