import { Repository } from 'typeorm';
import { Manager } from "../entities/manager.entity";
import { ManagerUpdateDto } from "src/dtos/manager-update.dto";
import { MailService } from 'src/mail/mail.service';
export declare class ManagerService {
    private managerRepo;
    private mailService;
    constructor(managerRepo: Repository<Manager>, mailService: MailService);
    getManagers(): Promise<any>;
    getManagerById(id: any): Promise<{
        name: string;
        email: string;
        address: string;
    }>;
    manager_profie(email: any): Promise<any>;
    getTotalManagers(): Promise<number>;
    addManager(mydto: any): Promise<void>;
    updateManager(name: any, email: any): any;
    updateManagerbyId(mydto: ManagerUpdateDto, id: any): any;
    deleteManagerbyId(id: any): Promise<import("typeorm").DeleteResult>;
    updateProfile(email: any, mydto: any): Promise<{
        message: string;
    }>;
    signin(mydto: any): Promise<false | Manager>;
    Email(mydata: any): Promise<{
        simulated: boolean;
        messageId: any;
    }>;
}
