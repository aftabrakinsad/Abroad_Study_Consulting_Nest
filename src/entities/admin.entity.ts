import { Manager } from 'src/entities/manager.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Unique } from 'typeorm';

@Entity("admin")
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  address: string;

  // The master admin is the only one who can create, edit or delete other admins
  @Column({ default: false })
  isMaster: boolean;
  
  // @OneToMany(() => Manager, (manager) => manager.admin)
  // managers: Manager[];
}