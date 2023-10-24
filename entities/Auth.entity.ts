import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';

import Administrator from './Administrator.entity';
import User from './User.entity';

// La decoración @Entity indica que esta clase representa una entidad en la base de datos.
@Entity()
class Auth {
  // La decoración @PrimaryGeneratedColumn() indica que esta columna es la clave primaria y se genera automáticamente.
  @PrimaryGeneratedColumn()
  id: number;

  // La decoración @Column() define una columna en la base de datos.
  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'boolean', default: false })
  isActiveAccount: boolean;

  // La decoración @OneToOne() indica una relación uno a uno con la entidad User.
  @OneToOne(() => User, (user) => user.auth)
  user: User;

  // La decoración @OneToOne() indica una relación uno a uno con la entidad Administrator.
  @OneToOne(() => Administrator, (administrator) => administrator.auth)
  administrator: Administrator;
}

export default Auth;
