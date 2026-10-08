import { Module } from "@nestjs/common";
import { StudentModule } from '../student/student.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminController } from "./admin.controller"
import { AdminService } from "./admin.service"
import { Admin } from "../entities/admin.entity"
import { ManagerService } from "../manager/manager.service";
import { Manager } from "../entities/manager.entity";
import { ConsultantService } from "../consultant/consultant.service";
import { Consultant } from "../entities/consultant.entity";
import { DemoSeedService } from "../seed/demo-seed.service";
import { Student } from "../entities/student.entity";
import { Application } from "../entities/application.entity";

@Module({
    imports: [StudentModule, TypeOrmModule.forFeature([Admin, Manager, Consultant, Student, Application])],
    controllers: [AdminController],
    providers: [AdminService, ManagerService, ConsultantService, DemoSeedService],
})

export class AdminModule {}
