import { Module } from "@nestjs/common";
import { StudentModule } from 'src/student/student.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Manager } from "../entities/manager.entity";
import { Consultant } from "../entities/consultant.entity";
import { ManagerController } from "./manager.controller";
import { ManagerService } from "./manager.service";
import { ConsultantService } from "../consultant/consultant.service";

@Module({
    imports: [StudentModule, TypeOrmModule.forFeature([Manager, Consultant])],
    controllers: [ManagerController],
    providers: [ManagerService, ConsultantService],
})

export class ManagerModule {}
