import { JwtService } from '@nestjs/jwt';
import { ManagerService } from "../manager/manager.service";
import { ConsultantService } from './consultant.service';
import { ConsultantDto } from "../dtos/Consultant.dto";
import { ApplicationService } from "../student/application.service";
export declare class ConsultantController {
    private consultantService;
    private managerService;
    private jwtService;
    private applicationService;
    constructor(consultantService: ConsultantService, managerService: ManagerService, jwtService: JwtService, applicationService: ApplicationService);
    signin(mydto: ConsultantDto): Promise<{
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
    getManagers(): any;
    getApplications(req: any): any;
    updateApplication(req: any, id: number, mydto: any): any;
    sendEmail(mydata: any): Promise<{
        message: string;
        result: {
            simulated: boolean;
            messageId: string;
        };
    }>;
}
