import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/entities/student.entity';
import { Application } from 'src/entities/application.entity';
import { Consultant } from 'src/entities/consultant.entity';
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
