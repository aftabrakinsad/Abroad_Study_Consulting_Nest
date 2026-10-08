import { Module } from '@nestjs/common';
import { StudentModule } from '../student/student.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consultant } from '../entities/consultant.entity';
import { Manager } from '../entities/manager.entity';
import { ConsultantController } from './consultant.controller';
import { ConsultantService } from './consultant.service';
import { ManagerService } from '../manager/manager.service';

@Module({
  imports: [StudentModule, TypeOrmModule.forFeature([Consultant, Manager])],
  controllers: [ConsultantController],
  providers: [ConsultantService, ManagerService]
})
export class ConsultantModule {}
