import { JwtService } from '@nestjs/jwt';
import { ConsultantService } from 'src/consultant/consultant.service';
import { ManagerService } from './manager.service';
import { ManagerDto } from 'src/dtos/manager.dto';
import { ApplicationService } from 'src/student/application.service';
export declare class ManagerController {
    private managerService;
    private consultantService;
    private jwtService;
    private applicationService;
    constructor(managerService: ManagerService, consultantService: ConsultantService, jwtService: JwtService, applicationService: ApplicationService);
    signin(mydto: ManagerDto): Promise<{
        message: string;
        token: string;
        email: string;
        name: string;
        role: string;
    }>;
    signout(): {
        message: string;
    };
    getProfile(req: any): any;
    updateProfile(req: any, mydto: any): any;
    getConsultants(): any;
    getApplications(): any;
    assignApplication(id: number, consultantId: any): any;
    sendEmail(mydata: any): Promise<{
        message: string;
        result: {
            simulated: boolean;
            messageId: any;
        };
    }>;
}
