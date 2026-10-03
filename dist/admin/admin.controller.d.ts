import { JwtService } from '@nestjs/jwt';
import { ManagerService } from 'src/manager/manager.service';
import { AdminUpdateDto } from '../dtos/admin-update.dto';
import { AdminService } from './admin.service';
import { AdminDto } from '../dtos/admin.dto';
import { ManagerDto } from 'src/dtos/manager.dto';
import { ConsultantDto } from 'src/dtos/Consultant.dto';
import { ConsultantService } from 'src/consultant/consultant.service';
import { ManagerUpdateDto } from 'src/dtos/manager-update.dto';
import { CounsultantUpdateDto } from 'src/dtos/consultant-update.dtp';
import { StudentService } from 'src/student/student.service';
import { ApplicationService } from 'src/student/application.service';
export declare class AdminController {
    private adminService;
    private managerService;
    private consultantService;
    private jwtService;
    private studentService;
    private applicationService;
    constructor(adminService: AdminService, managerService: ManagerService, consultantService: ConsultantService, jwtService: JwtService, studentService: StudentService, applicationService: ApplicationService);
    private requireMaster;
    getAdmin(): any;
    getManagers(): any;
    getConsultants(): any;
    getAdminStatistics(): any;
    getManagerStatistics(): any;
    getConsultantStatistics(): any;
    getProfile(req: any): any;
    getUserStatistics(): any;
    getApplicationStatistics(): any;
    getUsers(): any;
    getUserByID(id: number): any;
    deleteUser(id: number): any;
    getApplications(): any;
    assignApplication(id: number, consultantId: any): any;
    getAdminByID(id: number): any;
    getConsultantByID(id: number): any;
    getManagerByID(id: number): any;
    getAdminByName(username: string): any;
    getAdminByEmail(email: string): any;
    updateAdmin(req: any, adminDto: AdminDto): Promise<any>;
    updateManager(req: any, name: string): any;
    updateConsultant(req: any, name: string): any;
    updateAdminbyid(req: any, mydto: AdminUpdateDto, id: number): any;
    updateManagerbyid(mydto: ManagerUpdateDto, id: number): any;
    updateConsultantbyid(mydto: CounsultantUpdateDto, id: number): any;
    deleteAdminbyId(req: any, id: number): any;
    deleteManagerId(id: number): any;
    deleteConsultantId(id: number): any;
    addAdmin(req: any, admindto: AdminDto): Promise<any>;
    addManager(managerDto: ManagerDto): Promise<any>;
    addConsultant(consultantDto: ConsultantDto): Promise<any>;
    signin(mydto: AdminDto): Promise<{
        message: string;
        token: string;
        email: string;
        name: string;
        role: string;
        master: boolean;
    }>;
    signout(): {
        message: string;
    };
    sendEmail(mydata: any): Promise<{
        message: string;
        result: {
            simulated: boolean;
            messageId: any;
        };
        error?: undefined;
    } | {
        message: string;
        error: any;
        result?: undefined;
    }>;
}
