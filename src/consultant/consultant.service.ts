import { MailService } from '../mail/mail.service';
import { ForbiddenException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConsultantDto } from '../dtos/Consultant.dto';
import { CounsultantUpdateDto } from '../dtos/consultant-update.dtp';
import { Consultant } from '../entities/consultant.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { isDemoAccount } from '../auth/demo';

@Injectable()
export class ConsultantService {
    constructor(
        @InjectRepository(Consultant)
        private consultantRepo: Repository<Consultant>,
        private mailService: MailService
    ) { }

    async getConsultants(): Promise<any> {
        const rows = await this.consultantRepo.find({ order: { id: 'ASC' } });
        return rows.map(({ password, ...row }) => row);
    }

    async getTotalConsultants(): Promise<number> {
        return this.consultantRepo.count();
    }

    async con_profie(email): Promise<any>
    {
        const data = await this.consultantRepo.findOne({ where: { email } });
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

    updateConsultant(name, email): any
    {
        return this.consultantRepo.update({ email:email },{ name:name });
    }

    async updateConsultantbyid(mydto, id)
    {
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(mydto.password, salt);
        mydto.password = hashedPassword;

        const existingConsultantPhone = await this.consultantRepo.findOne({ where: { phone: mydto.phone } });
        const existingConsultantEmail = await this.consultantRepo.findOne({ where: { email: mydto.email } });

        if (mydto.name === '')
        {
            throw new HttpException({ message: "Please provide the username" }, HttpStatus.BAD_REQUEST);
        } 
        else if (mydto.phone === '')
        {
            throw new HttpException({ message: "Please provide the phone number" }, HttpStatus.BAD_REQUEST);
        }
        else if (mydto.email === '')
        {
            throw new HttpException({ message: "Please provide the email" }, HttpStatus.BAD_REQUEST);
        }
        else if (mydto.password === '')
        {
            throw new HttpException({ message: "Please provide the password" }, HttpStatus.BAD_REQUEST);
        }
        else if (mydto.country === '')
        {
            throw new HttpException({ message: "Please provide the country" }, HttpStatus.BAD_REQUEST);
        }
        // else if (existingConsultant)
        // {
        //     throw new HttpException({ message: "Username already exists" }, HttpStatus.BAD_REQUEST);
        // }
        else if(existingConsultantPhone)
        {
            throw new HttpException({ message: "Phone number already exists" }, HttpStatus.BAD_REQUEST);
        }
        else if(existingConsultantEmail)
        {
            throw new HttpException({ message: "Email already exists" }, HttpStatus.BAD_REQUEST);
        }
        else 
        {
            await this.consultantRepo.update(id, mydto);
            throw new HttpException('Consultant Added Successful.', HttpStatus.OK);
        }
    }

    async deleteConsultantId(id)
    {
        const consultant = await this.consultantRepo.findOne({ where: { id } });
        if (consultant && isDemoAccount(consultant.email))
        {
            throw new ForbiddenException({ message: "The demo account can't be deleted" });
        }
        return this.consultantRepo.delete(id);
    }

    // Lets a signed-in consultant edit their own details and (optionally) password
    async updateProfile(email, mydto)
    {
        for (const [field, label] of [['name', 'name'], ['phone', 'phone number'], ['country', 'country']])
        {
            if (!mydto[field] || mydto[field].trim() === '')
            {
                throw new HttpException({ message: `Please provide the ${label}` }, HttpStatus.BAD_REQUEST);
            }
        }
        const samePhone = await this.consultantRepo.findOne({ where: { phone: mydto.phone } });
        if (samePhone && samePhone.email !== email)
        {
            throw new HttpException({ message: "Phone number already exists" }, HttpStatus.BAD_REQUEST);
        }
        const changes: Partial<Consultant> = { name: mydto.name, phone: mydto.phone, country: mydto.country };
        if (mydto.password && !isDemoAccount(email))
        {
            changes.password = await bcrypt.hash(mydto.password, await bcrypt.genSalt());
        }
        await this.consultantRepo.update({ email }, changes);
        return { message: 'Profile updated' };
    }

    async signin(mydto)
    {
        if (!mydto.email || !mydto.password)
        {
            throw new UnauthorizedException({ message: "invalid credentials" });
        }
        const mydata = await this.consultantRepo.findOneBy({ email: mydto.email });
        if (!mydata)
        {
            throw new UnauthorizedException({ message: "Email didn't match" });
        }
        const isMatch = await bcrypt.compare(mydto.password, mydata.password);
        return isMatch ? mydata : false;
    }

    async addConsultant(mydto)
    {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(mydto.password, salt);
        mydto.password = hashedPassword;

        // const existingConsultant = await this.consultantRepo.findOne({ where: { name: mydto.name } });
        const existingConsultantPhone = await this.consultantRepo.findOne({ where: { phone: mydto.phone } });
        const existingConsultantEmail = await this.consultantRepo.findOne({ where: { email: mydto.email } });

        if (mydto.name === '')
        {
            throw new HttpException({ message: "Please provide the username" }, HttpStatus.BAD_REQUEST);
        } 
        else if (mydto.phone === '')
        {
            throw new HttpException({ message: "Please provide the phone number" }, HttpStatus.BAD_REQUEST);
        }
        else if (mydto.email === '')
        {
            throw new HttpException({ message: "Please provide the email" }, HttpStatus.BAD_REQUEST);
        }
        else if (mydto.password === '')
        {
            throw new HttpException({ message: "Please provide the password" }, HttpStatus.BAD_REQUEST);
        }
        else if (mydto.country === '')
        {
            throw new HttpException({ message: "Please provide the country" }, HttpStatus.BAD_REQUEST);
        }
        // else if (existingConsultant)
        // {
        //     throw new HttpException({ message: "Username already exists" }, HttpStatus.BAD_REQUEST);
        // }
        else if(existingConsultantPhone)
        {
            throw new HttpException({ message: "Phone number already exists" }, HttpStatus.BAD_REQUEST);
        }
        else if(existingConsultantEmail)
        {
            throw new HttpException({ message: "Email already exists" }, HttpStatus.BAD_REQUEST);
        }
        else 
        {
            await this.consultantRepo.save(mydto);
            throw new HttpException('Consultant Added Successful.', HttpStatus.OK);
        }
    }

    async getConsultantById(id)
    {
        const data = await this.consultantRepo.findOne({ where: { id } });

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


    async Email(mydata)
    {
        return  await this.mailService.sendMail({
            to: mydata.email,
            subject: mydata.subject,
            text: mydata.text, 
        });
    }
}
