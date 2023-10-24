import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import Auth from './Auth.entity';

// La decoración @Entity indica que esta clase representa una entidad en la base de datos.
@Entity()
class Administrator {
  // La decoración @PrimaryGeneratedColumn() indica que esta columna es la clave primaria y se genera automáticamente.
  @PrimaryGeneratedColumn()
  id: number;

  // La decoración @Column() define una columna en la base de datos.
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  // La decoración @OneToOne() indica una relación uno a uno con la entidad Auth.
  @OneToOne(() => Auth, (auth) => auth.user, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn() // Establece una columna que actúa como clave foránea para la relación.
  auth: Auth;
}

export default Administrator;
