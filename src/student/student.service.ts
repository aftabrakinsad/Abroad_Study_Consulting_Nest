import { ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Student } from 'src/entities/student.entity';
import { isDemoAccount } from 'src/auth/demo';

const EMAIL = /\S+@\S+\.\S+/;

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Student)
        private studentRepo: Repository<Student>,
    ) { }

    private strip({ password, applications, ...student }: Student) {
        return student;
    }

    async getStudents() {
        const students = await this.studentRepo.find({ order: { id: 'ASC' } });
        return students.map((s) => this.strip(s));
    }

    getTotalStudents(): Promise<number> {
        return this.studentRepo.count();
    }

    async getStudentById(id) {
        const student = await this.studentRepo.findOne({ where: { id } });
        if (!student) throw new NotFoundException({ message: 'Not Found' });
        return this.strip(student);
    }

    async profile(email) {
        const student = await this.studentRepo.findOne({ where: { email } });
        if (!student) throw new NotFoundException({ message: 'Not Found' });
        return this.strip(student);
    }

    async signup(mydto)
    {
        for (const [field, label] of [['name', 'name'], ['email', 'email'], ['phone', 'phone number'], ['password', 'password']])
        {
            if (!mydto[field] || String(mydto[field]).trim() === '')
            {
                throw new HttpException({ message: `Please provide the ${label}` }, HttpStatus.BAD_REQUEST);
            }
        }
        if (!EMAIL.test(mydto.email))
        {
            throw new HttpException({ message: "Please provide a valid email" }, HttpStatus.BAD_REQUEST);
        }
        if (await this.studentRepo.findOne({ where: { email: mydto.email } }))
        {
            throw new HttpException({ message: "Email already exists" }, HttpStatus.BAD_REQUEST);
        }
        await this.studentRepo.save({
            name: mydto.name,
            email: mydto.email,
            phone: mydto.phone,
            password: await bcrypt.hash(mydto.password, await bcrypt.genSalt()),
        });
        return { message: 'Registration Successful' };
    }

    async signin(mydto)
    {
        if (!mydto.email || !mydto.password)
        {
            throw new UnauthorizedException({ message: "invalid credentials" });
        }
        const student = await this.studentRepo.findOneBy({ email: mydto.email });
        if (!student)
        {
            throw new UnauthorizedException({ message: "Email didn't match" });
        }
        return (await bcrypt.compare(mydto.password, student.password)) ? student : false;
    }

    async updateProfile(email, mydto)
    {
        for (const [field, label] of [['name', 'name'], ['phone', 'phone number']])
        {
            if (!mydto[field] || mydto[field].trim() === '')
            {
                throw new HttpException({ message: `Please provide the ${label}` }, HttpStatus.BAD_REQUEST);
            }
        }
        const changes: Partial<Student> = { name: mydto.name, phone: mydto.phone };
        if (mydto.password && !isDemoAccount(email))
        {
            changes.password = await bcrypt.hash(mydto.password, await bcrypt.genSalt());
        }
        await this.studentRepo.update({ email }, changes);
        return { message: 'Profile updated' };
    }

    async deleteStudent(id)
    {
        const student = await this.studentRepo.findOne({ where: { id } });
        if (student && isDemoAccount(student.email))
        {
            throw new ForbiddenException({ message: "The demo account can't be deleted" });
        }
        return this.studentRepo.delete(id);
    }
}
