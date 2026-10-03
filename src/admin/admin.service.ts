import { ForbiddenException, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from "../entities/admin.entity";
import { AdminUpdateDto } from "../dtos/admin-update.dto";
import * as bcrypt from 'bcryptjs';
import { MailService } from 'src/mail/mail.service';
import { isDemoAccount } from 'src/auth/demo';
@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Admin)
        private adminRepo: Repository<Admin>,
        private mailService: MailService  
    ) {}

    async getIndex(): Promise<any> {
        const admins = await this.adminRepo.find({ order: { id: 'ASC' } });
        return admins.map(({ password, ...admin }) => admin);
    }

    getTotalAdmins(): any {
        return this.adminRepo.count();
    }

    async myprofie(email): Promise<any>
    {
        const data = await this.adminRepo.findOne({ where: { email } });
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

    async getAdminById(id)
    {
        const data = await this.adminRepo.findOne({ where: { id } });

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

    async getAdminByName(username)
    {
        const data = await this.adminRepo.findOne({ where: { username } });

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

    async getAdminByEmail(email)
    {
        const data = await this.adminRepo.findOne({ where: { email } });

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

    async addAdmin(mydto)
    {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(mydto.password, salt);
        mydto.password = hashedPassword;

        // const existingAdmin = await this.adminRepo.findOne({ where: { username: mydto.username } });
        const existingAdminEmail = await this.adminRepo.findOne({ where: { email: mydto.email } });

        if (mydto.username === '')
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
        // else if (existingAdmin)
        // {
        //     throw new HttpException({ message: "Username already exists" }, HttpStatus.BAD_REQUEST);
        // }
        else if(existingAdminEmail)
        {
            throw new HttpException({ message: "Email already exists" }, HttpStatus.BAD_REQUEST);
        }
        else 
        {
            await this.adminRepo.save(mydto);
            throw new HttpException('New Admin Added', HttpStatus.OK);
        }
    }

    async updateAdmin(mydto, email)
    {
        // const existingAdmin = await this.adminRepo.findOne({ where: { username: mydto.username } });
        // const existingAdminEmail = await this.adminRepo.findOne({ where: { email: mydto.email } });

        if (mydto.username === '')
        {
            throw new HttpException({ message: "Please provide the username" }, HttpStatus.BAD_REQUEST);
        } 
        // else if(existingAdminEmail)
        // {
        //     throw new HttpException({ message: "Email already exists" }, HttpStatus.BAD_REQUEST);
        // }
        else 
        {
            const changes: Partial<Admin> = { username: mydto.username, address: mydto.address };
            // Password is optional; the demo account's password never changes so the next visitor can still log in
            if (mydto.password && !isDemoAccount(email))
            {
                changes.password = await bcrypt.hash(mydto.password, await bcrypt.genSalt());
            }
            await this.adminRepo.update({ email }, changes);
            throw new HttpException('Admin Updated', HttpStatus.OK);
        }
    }

    updateAdminbyId(mydto: AdminUpdateDto, id): any
    {
        return this.adminRepo.update(id, mydto);
    }

    async deleteAdminbyId(id)
    {
        const admin = await this.adminRepo.findOne({ where: { id } });
        if (admin && isDemoAccount(admin.email))
        {
            throw new ForbiddenException({ message: "The demo account can't be deleted" });
        }
        return this.adminRepo.delete(id);
    }
        
    // ManagersByAdminId(id): any
    // {
    //     return this.adminRepo.find({ 
    //         where: {id:id},
    //         relations: {
    //             managers: true,
    //         },
    //     });
    // }


    async signin(mydto)
    {
        if (mydto.email != null && mydto.password != null)
        {
            const mydata = await this.adminRepo.findOneBy({ email: mydto.email });
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

    async sendEmail(mydata) {
    try {
      const result = await this.mailService.sendMail({
        to: mydata.email,
        subject: mydata.subject,
        text: mydata.text
      });
      return result;
    } catch (error) {
      throw new Error(`Error sending email: ${error.message}`);
    }
  }
}