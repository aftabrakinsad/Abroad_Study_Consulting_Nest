import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Student } from './student.entity';
import { Consultant } from './consultant.entity';

export const APPLICATION_STATUSES = ['Submitted', 'In Review', 'Documents Needed', 'Accepted', 'Rejected'];

// A student's request for help applying to study in a given country
@Entity("application")
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, (student) => student.applications, { onDelete: 'CASCADE' })
  student: Student;

  // Assigned by a manager or admin; cleared if the consultant is deleted
  @ManyToOne(() => Consultant, { nullable: true, onDelete: 'SET NULL' })
  consultant: Consultant;

  @Column()
  destinationCountry: string;

  @Column()
  studyLevel: string;

  @Column()
  program: string;

  @Column()
  intake: string;

  @Column({ type: 'text', default: '' })
  message: string;

  @Column({ default: 'Submitted' })
  status: string;

  // Feedback from the consultant, shown to the student
  @Column({ type: 'text', default: '' })
  consultantNote: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
