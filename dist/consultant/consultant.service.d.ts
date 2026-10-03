import { MailService } from "../mail/mail.service";
import { Consultant } from "../entities/consultant.entity";
import { Repository } from 'typeorm';
export declare class ConsultantService {
    private consultantRepo;
    private mailService;
    constructor(consultantRepo: Repository<Consultant>, mailService: MailService);
    getConsultants(): Promise<any>;
    getTotalConsultants(): Promise<number>;
    con_profie(email: any): Promise<any>;
    updateConsultant(name: any, email: any): any;
    updateConsultantbyid(mydto: any, id: any): Promise<void>;
    deleteConsultantId(id: any): Promise<import("typeorm").DeleteResult>;
    updateProfile(email: any, mydto: any): Promise<{
        message: string;
    }>;
    signin(mydto: any): Promise<false | Consultant>;
    addConsultant(mydto: any): Promise<void>;
    getConsultantById(id: any): Promise<{
        name: string;
        phone: string;
        email: string;
        country: string;
    }>;
    Email(mydata: any): Promise<{
        simulated: boolean;
        messageId: string;
    }>;
}
