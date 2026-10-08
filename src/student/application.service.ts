import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application, APPLICATION_STATUSES } from '../entities/application.entity';
import { Consultant } from '../entities/consultant.entity';

@Injectable()
export class ApplicationService {
    constructor(
        @InjectRepository(Application)
        private applicationRepo: Repository<Application>,
        @InjectRepository(Consultant)
        private consultantRepo: Repository<Consultant>,
    ) { }

    // Never send password hashes of the related student or consultant
    private view(app: Application) {
        const { student, consultant, ...rest } = app;
        return {
            ...rest,
            student: student ? { id: student.id, name: student.name, email: student.email, phone: student.phone } : null,
            consultant: consultant
                ? { id: consultant.id, name: consultant.name, email: consultant.email, phone: consultant.phone, country: consultant.country }
                : null,
        };
    }

    private async find(where = {}) {
        const apps = await this.applicationRepo.find({
            where,
            relations: { student: true, consultant: true },
            order: { createdAt: 'DESC' },
        });
        return apps.map((a) => this.view(a));
    }

    getAll() {
        return this.find();
    }

    getForStudent(studentId: number) {
        return this.find({ student: { id: studentId } });
    }

    getForConsultant(consultantId: number) {
        return this.find({ consultant: { id: consultantId } });
    }

    getTotal(): Promise<number> {
        return this.applicationRepo.count();
    }

    async create(studentId: number, mydto)
    {
        for (const [field, label] of [['destinationCountry', 'destination country'], ['studyLevel', 'study level'], ['program', 'program'], ['intake', 'intake']])
        {
            if (!mydto[field] || String(mydto[field]).trim() === '')
            {
                throw new HttpException({ message: `Please provide the ${label}` }, HttpStatus.BAD_REQUEST);
            }
        }
        await this.applicationRepo.save({
            student: { id: studentId },
            destinationCountry: mydto.destinationCountry,
            studyLevel: mydto.studyLevel,
            program: mydto.program,
            intake: mydto.intake,
            message: mydto.message || '',
        });
        return { message: 'Application submitted' };
    }

    async assign(id: number, consultantId)
    {
        const app = await this.applicationRepo.findOne({ where: { id } });
        if (!app) throw new NotFoundException({ message: 'Application not found' });

        let consultant = null;
        if (consultantId)
        {
            consultant = await this.consultantRepo.findOne({ where: { id: Number(consultantId) } });
            if (!consultant) throw new NotFoundException({ message: 'Consultant not found' });
        }
        app.consultant = consultant;
        if (consultant && app.status === 'Submitted') app.status = 'In Review';
        await this.applicationRepo.save(app);
        return { message: consultant ? `Assigned to ${consultant.name}` : 'Consultant removed' };
    }

    // Consultants can only update applications assigned to them
    async updateStatus(id: number, consultantId: number, mydto)
    {
        const app = await this.applicationRepo.findOne({ where: { id, consultant: { id: consultantId } } });
        if (!app) throw new NotFoundException({ message: 'Application not found' });
        if (!APPLICATION_STATUSES.includes(mydto.status))
        {
            throw new HttpException({ message: 'Invalid status' }, HttpStatus.BAD_REQUEST);
        }
        app.status = mydto.status;
        app.consultantNote = mydto.consultantNote ?? app.consultantNote;
        await this.applicationRepo.save(app);
        return { message: 'Application updated' };
    }
}
