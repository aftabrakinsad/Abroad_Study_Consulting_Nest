import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../entities/student.entity';
import { Application } from '../entities/application.entity';
import { Consultant } from '../entities/consultant.entity';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { ApplicationService } from './application.service';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Application, Consultant])],
  controllers: [StudentController],
  providers: [StudentService, ApplicationService],
  exports: [StudentService, ApplicationService],
})
export class StudentModule {}
