import { Exclude, Transform } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Transform(({ value }) => value.trim().toLowerCase())
  @Column()
  name: string;

  @Transform(({ value }) => value.trim().toLowerCase())
  @Column()
  lastName: string;

  @Transform(({ value }) => value.trim().toLowerCase())
  @Column()
  email: string;

  @Column()
  @Exclude() // Nunca incluir el hash en respuestas JSON
  password: string;

  @Column()
  documentNumber: string;

  
}
