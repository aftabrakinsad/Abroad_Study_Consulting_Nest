import { Module } from "@nestjs/common";
import { StudentModule } from 'src/student/student.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminController } from "./admin.controller"
import { AdminService } from "./admin.service"
import { Admin } from "../entities/admin.entity"
import { ManagerService } from "src/manager/manager.service";
import { Manager } from "src/entities/manager.entity";
import { ConsultantService } from "src/consultant/consultant.service";
import { Consultant } from "src/entities/consultant.entity";
import { DemoSeedService } from "src/seed/demo-seed.service";
import { Student } from "src/entities/student.entity";
import { Application } from "src/entities/application.entity";

@Module({
    imports: [StudentModule, TypeOrmModule.forFeature([Admin, Manager, Consultant, Student, Application])],
    controllers: [AdminController],
    providers: [AdminService, ManagerService, ConsultantService, DemoSeedService],
})

export class AdminModule {}
