import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { Application } from './application.entity';

// The site's users: students who register themselves and apply for consultation.
// The table is called "student" because "user" is a reserved word in PostgreSQL.
@Entity("student")
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Application, (application) => application.student)
  applications: Application[];
}
