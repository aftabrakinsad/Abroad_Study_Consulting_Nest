"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultantService = void 0;
const mail_service_1 = require("../mail/mail.service");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const consultant_entity_1 = require("../entities/consultant.entity");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const demo_1 = require("../auth/demo");
let ConsultantService = class ConsultantService {
    constructor(consultantRepo, mailService) {
        this.consultantRepo = consultantRepo;
        this.mailService = mailService;
    }
    async getConsultants() {
        const rows = await this.consultantRepo.find({ order: { id: 'ASC' } });
        return rows.map((_a) => {
            var { password } = _a, row = __rest(_a, ["password"]);
            return row;
        });
    }
    async getTotalConsultants() {
        return this.consultantRepo.count();
    }
    async con_profie(email) {
        const data = await this.consultantRepo.findOne({ where: { email } });
        if (data !== null) {
            const { password } = data, filteredData = __rest(data, ["password"]);
            return filteredData;
        }
        else {
            throw new common_1.HttpException('Not Found', common_1.HttpStatus.NOT_FOUND);
        }
    }
    updateConsultant(name, email) {
        return this.consultantRepo.update({ email: email }, { name: name });
    }
    async updateConsultantbyid(mydto, id) {
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(mydto.password, salt);
        mydto.password = hashedPassword;
        const existingConsultantPhone = await this.consultantRepo.findOne({ where: { phone: mydto.phone } });
        const existingConsultantEmail = await this.consultantRepo.findOne({ where: { email: mydto.email } });
        if (mydto.name === '') {
            throw new common_1.HttpException({ message: "Please provide the username" }, common_1.HttpStatus.BAD_REQUEST);
        }
        else if (mydto.phone === '') {
            throw new common_1.HttpException({ message: "Please provide the phone number" }, common_1.HttpStatus.BAD_REQUEST);
        }
        else if (mydto.email === '') {
            throw new common_1.HttpException({ message: "Please provide the email" }, common_1.HttpStatus.BAD_REQUEST);
        }
        else if (mydto.password === '') {
            throw new common_1.HttpException({ message: "Please provide the password" }, common_1.HttpStatus.BAD_REQUEST);
        }
        else if (mydto.country === '') {
            throw new common_1.HttpException({ message: "Please provide the country" }, common_1.HttpStatus.BAD_REQUEST);
        }
        else if (existingConsultantPhone) {
            throw new common_1.HttpException({ message: "Phone number already exists" }, common_1.HttpStatus.BAD_REQUEST);
        }
        else if (existingConsultantEmail) {
            throw new common_1.HttpException({ message: "Email already exists" }, common_1.HttpStatus.BAD_REQUEST);
        }
        else {
            await this.consultantRepo.update(id, mydto);
            throw new common_1.HttpException('Consultant Added Successful.', common_1.HttpStatus.OK);
        }
    }
    async deleteConsultantId(id) {
        const consultant = await this.consultantRepo.findOne({ where: { id } });
        if (consultant && (0, demo_1.isDemoAccount)(consultant.email)) {
            throw new common_1.ForbiddenException({ message: "The demo account can't be deleted" });
        }
        return this.consultantRepo.delete(id);
    }
    async updateProfile(email, mydto) {
        for (const [field, label] of [['name', 'name'], ['phone', 'phone number'], ['country', 'country']]) {
            if (!mydto[field] || mydto[field].trim() === '') {
                throw new common_1.HttpException({ message: `Please provide the ${label}` }, common_1.HttpStatus.BAD_REQUEST);
            }
        }
        const samePhone = await this.consultantRepo.findOne({ where: { phone: mydto.phone } });
        if (samePhone && samePhone.email !== email) {
            throw new common_1.HttpException({ message: "Phone number already exists" }, common_1.HttpStatus.BAD_REQUEST);
        }
        const changes = { name: mydto.name, phone: mydto.phone, country: mydto.country };
        if (mydto.password && !(0, demo_1.isDemoAccount)(email)) {
            changes.password = await bcrypt.hash(mydto.password, await bcrypt.genSalt());
        }
        await this.consultantRepo.update({ email }, changes);
        return { message: 'Profile updated' };
    }
    async signin(mydto) {
        if (!mydto.email || !mydto.password) {
            throw new common_1.UnauthorizedException({ message: "invalid credentials" });
        }
        const mydata = await this.consultantRepo.findOneBy({ email: mydto.email });
        if (!mydata) {
            throw new common_1.UnauthorizedException({ message: "Email didn't match" });
        }
        const isMatch = await bcrypt.compare(mydto.password, mydata.password);
        return isMatch ? mydata : false;
    }
    async addConsultant(mydto) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(mydto.password, salt);
        mydto.password = hashedPassword;
        const existingConsultantPhone = await this.consultantRepo.findOne({ where: { phone: mydto.phone } });
        const existingConsultantEmail = await this.consultantRepo.findOne({ where: { email: mydto.email } });
        if (mydto.name === '') {
            throw new common_1.HttpException({ message: "Please provide the username" }, common_1.HttpStatus.BAD_REQUEST);
        }
        else if (mydto.phone === '') {
            throw new common_1.HttpException({ message: "Please provide the phone number" }, common_1.HttpStatus.BAD_REQUEST);
        }
        else if (mydto.email === '') {
            throw new common_1.HttpException({ message: "Please provide the email" }, common_1.HttpStatus.BAD_REQUEST);
        }
        else if (mydto.password === '') {
            throw new common_1.HttpException({ message: "Please provide the password" }, common_1.HttpStatus.BAD_REQUEST);
        }
        else if (mydto.country === '') {
            throw new common_1.HttpException({ message: "Please provide the country" }, common_1.HttpStatus.BAD_REQUEST);
        }
        else if (existingConsultantPhone) {
            throw new common_1.HttpException({ message: "Phone number already exists" }, common_1.HttpStatus.BAD_REQUEST);
        }
        else if (existingConsultantEmail) {
            throw new common_1.HttpException({ message: "Email already exists" }, common_1.HttpStatus.BAD_REQUEST);
        }
        else {
            await this.consultantRepo.save(mydto);
            throw new common_1.HttpException('Consultant Added Successful.', common_1.HttpStatus.OK);
        }
    }
    async getConsultantById(id) {
        const data = await this.consultantRepo.findOne({ where: { id } });
        if (data !== null) {
            const { id, password } = data, filteredData = __rest(data, ["id", "password"]);
            return filteredData;
        }
        else {
            throw new common_1.HttpException('Not Found', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async Email(mydata) {
        return await this.mailService.sendMail({
            to: mydata.email,
            subject: mydata.subject,
            text: mydata.text,
        });
    }
};
ConsultantService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(consultant_entity_1.Consultant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        mail_service_1.MailService])
], ConsultantService);
exports.ConsultantService = ConsultantService;
//# sourceMappingURL=consultant.service.js.map