import { ForbiddenException, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manager } from "../entities/manager.entity";
import { ManagerDto } from "../dtos/manager.dto";
import { Admin } from "src/entities/admin.entity";
import { ManagerUpdateDto } from "src/dtos/manager-update.dto";
import { MailService } from 'src/mail/mail.service';
import * as bcrypt from 'bcryptjs';
import { isDemoAccount } from 'src/auth/demo';


@Injectable()
export class ManagerService {
    constructor(
        @InjectRepository(Manager)
        private managerRepo: Repository<Manager>,
        private mailService: MailService
     ) {}

    async getManagers(): Promise<any> {
        const rows = await this.managerRepo.find({ order: { id: 'ASC' } });
        return rows.map(({ password, ...row }) => row);
    }

    async getManagerById(id)
    {
        const data = await this.managerRepo.findOne({ where: { id } });

        if (data !== null)
        {
            const { id, password, ...filteredData } = data;
            return filteredData;
        }
        else
        {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
    }
    
    async manager_profie(email): Promise<any>
    {
        const data = await this.managerRepo.findOne({ where: { email } });
        if (data !== null)
        {
            const { password, ...filteredData } = data;
            return filteredData;
        }
        else
        {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
    }

    async getTotalManagers(): Promise<number> {
        return this.managerRepo.count();
    }

    // addManager(mydto: ManagerDto): any 
    // {    
    //    return this.managerRepo.save(mydto);
    // }

    async addManager(mydto) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(mydto.password, salt);
        mydto.password = hashedPassword;

        // const existingManager = await this.managerRepo.findOne({ where: { name: mydto.name } });
        const existingManagerEmail = await this.managerRepo.findOne({ where: { email: mydto.email } });

        if (mydto.name === '')
        {
            throw new HttpException({ message: "Please provide the username" }, HttpStatus.BAD_REQUEST);
        }
        else if (mydto.email === '')
        {
            throw new HttpException({ message: "Please provide the email" }, HttpStatus.BAD_REQUEST);
        }
        else if (mydto.password === '')
        {
            throw new HttpException({ message: "Please provide the password" }, HttpStatus.BAD_REQUEST);
        }
        else if (mydto.address === '')
        {
            throw new HttpException({ message: "Please provide the address" }, HttpStatus.BAD_REQUEST);
        }
        // else if (existingManager)
        // {
        //     throw new HttpException({ message: "Username already exists" }, HttpStatus.BAD_REQUEST);
        // }
        else if(existingManagerEmail)
        {
            throw new HttpException({ message: "Email already exists" }, HttpStatus.BAD_REQUEST);
        }
        else 
        {
            await this.managerRepo.save(mydto);
            throw new HttpException('Manager Added Successful.', HttpStatus.OK);
        }
    }

    updateManager(name, email): any
    {
        return this.managerRepo.update({ email:email },{ name:name });
    }

    updateManagerbyId(mydto: ManagerUpdateDto, id): any
    {
        return this.managerRepo.update(id, mydto);
    }

    async deleteManagerbyId(id)
    {
        const manager = await this.managerRepo.findOne({ where: { id } });
        if (manager && isDemoAccount(manager.email))
        {
            throw new ForbiddenException({ message: "The demo account can't be deleted" });
        }
        return this.managerRepo.delete(id);
    }

    // Lets a signed-in manager edit their own name, address and (optionally) password
    async updateProfile(email, mydto)
    {
        if (!mydto.name || mydto.name.trim() === '')
        {
            throw new HttpException({ message: "Please provide the name" }, HttpStatus.BAD_REQUEST);
        }
        if (!mydto.address || mydto.address.trim() === '')
        {
            throw new HttpException({ message: "Please provide the address" }, HttpStatus.BAD_REQUEST);
        }
        const changes: Partial<Manager> = { name: mydto.name, address: mydto.address };
        if (mydto.password && !isDemoAccount(email))
        {
            changes.password = await bcrypt.hash(mydto.password, await bcrypt.genSalt());
        }
        await this.managerRepo.update({ email }, changes);
        return { message: 'Profile updated' };
    }
        
    // getAdminByManagerID(id): any {
    //     return this.managerRepo.find({ 
    //         where: { id: id },
    //         relations: {
    //             admin: true,
    //         },
    //     });
    // }


    async signin(mydto)
    {
        if (mydto.email != null && mydto.password != null)
        {
            const mydata = await this.managerRepo.findOneBy({ email: mydto.email });
            if (!mydata)
            {
                throw new UnauthorizedException({ message: "Email didn't match" });
            }
            const isMatch = await bcrypt.compare(mydto.password, mydata.password);
            if (isMatch)
            {
                return mydata;
            }
            else
            {
                return false;
            }
        }
        else
        {
            throw new UnauthorizedException({ message: "invalid credentials" });
        }
    }

    async Email(mydata)
    {
        return  await this.mailService.sendMail({
            to: mydata.email,
            subject: mydata.subject,
            text: mydata.text, 
        });
    }
}