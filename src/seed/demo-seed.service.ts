import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Admin } from '../entities/admin.entity';
import { Manager } from '../entities/manager.entity';
import { Consultant } from '../entities/consultant.entity';
import { Student } from '../entities/student.entity';
import { Application } from '../entities/application.entity';
import { demoAccounts } from '../auth/demo';

// Creates one demo account per role on startup, so visitors can log in without registering.
// The demo admin is the master admin, since staff accounts can only be created by admins.
@Injectable()
export class DemoSeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Admin) private adminRepo: Repository<Admin>,
    @InjectRepository(Manager) private managerRepo: Repository<Manager>,
    @InjectRepository(Consultant) private consultantRepo: Repository<Consultant>,
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(Application) private applicationRepo: Repository<Application>,
  ) {}

  async onModuleInit() {
    const password = process.env.DEMO_PASSWORD;
    if (!password) return;
    const hashed = await bcrypt.hash(password, await bcrypt.genSalt());
    const { admin, manager, consultant, user } = demoAccounts();

    if (admin) {
      const existing = await this.adminRepo.findOne({ where: { email: admin } });
      if (!existing) {
        await this.adminRepo.save({ username: 'master', email: admin, password: hashed, address: 'Dhaka, Bangladesh', isMaster: true });
      } else if (!existing.isMaster) {
        await this.adminRepo.update(existing.id, { isMaster: true });
      }
    }
    if (manager && !(await this.managerRepo.findOne({ where: { email: manager } }))) {
      await this.managerRepo.save({ name: 'Demo Manager', email: manager, password: hashed, address: 'Dhaka, Bangladesh' });
    }
    let demoConsultant = consultant ? await this.consultantRepo.findOne({ where: { email: consultant } }) : null;
    if (consultant && !demoConsultant) {
      demoConsultant = await this.consultantRepo.save({ name: 'Demo Consultant', phone: '01700000000', email: consultant, password: hashed, country: 'Canada' });
    }
    if (user && !(await this.studentRepo.findOne({ where: { email: user } }))) {
      const student = await this.studentRepo.save({ name: 'Demo Student', email: user, phone: '01800000000', password: hashed });
      // A sample application so the student, consultant and manager dashboards aren't empty
      await this.applicationRepo.save({
        student,
        consultant: demoConsultant,
        destinationCountry: 'Canada',
        studyLevel: "Master's",
        program: 'Computer Science',
        intake: 'Fall 2027',
        message: 'I would like help choosing universities with good funding opportunities.',
        status: 'In Review',
        consultantNote: 'Please upload your IELTS score and transcripts so we can shortlist universities.',
      });
    }
  }
}
