import { Module } from '@nestjs/common';
import { StudentModule } from 'src/student/student.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consultant } from 'src/entities/consultant.entity';
import { Manager } from 'src/entities/manager.entity';
import { ConsultantController } from './consultant.controller';
import { ConsultantService } from './consultant.service';
import { ManagerService } from 'src/manager/manager.service';

@Module({
  imports: [StudentModule, TypeOrmModule.forFeature([Consultant, Manager])],
  controllers: [ConsultantController],
  providers: [ConsultantService, ManagerService]
})
export class ConsultantModule {}
