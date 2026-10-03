import { Repository } from 'typeorm';
import { Admin } from "../entities/admin.entity";
import { AdminUpdateDto } from "../dtos/admin-update.dto";
import { MailService } from "../mail/mail.service";
export declare class AdminService {
    private adminRepo;
    private mailService;
    constructor(adminRepo: Repository<Admin>, mailService: MailService);
    getIndex(): Promise<any>;
    getTotalAdmins(): any;
    myprofie(email: any): Promise<any>;
    getAdminById(id: any): Promise<{
        username: string;
        email: string;
        address: string;
        isMaster: boolean;
    }>;
    getAdminByName(username: any): Promise<{
        username: string;
        email: string;
        address: string;
        isMaster: boolean;
    }>;
    getAdminByEmail(email: any): Promise<{
        username: string;
        email: string;
        address: string;
        isMaster: boolean;
    }>;
    addAdmin(mydto: any): Promise<void>;
    updateAdmin(mydto: any, email: any): Promise<void>;
    updateAdminbyId(mydto: AdminUpdateDto, id: any): any;
    deleteAdminbyId(id: any): Promise<import("typeorm").DeleteResult>;
    signin(mydto: any): Promise<false | Admin>;
    sendEmail(mydata: any): Promise<{
        simulated: boolean;
        messageId: string;
    }>;
}
