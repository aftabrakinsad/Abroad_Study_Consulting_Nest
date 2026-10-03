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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const admin_entity_1 = require("../entities/admin.entity");
const bcrypt = require("bcryptjs");
const mail_service_1 = require("../mail/mail.service");
const demo_1 = require("../auth/demo");
let AdminService = class AdminService {
    constructor(adminRepo, mailService) {
        this.adminRepo = adminRepo;
        this.mailService = mailService;
    }
    async getIndex() {
        const admins = await this.adminRepo.find({ order: { id: 'ASC' } });
        return admins.map((_a) => {
            var { password } = _a, admin = __rest(_a, ["password"]);
            return admin;
        });
    }
    getTotalAdmins() {
        return this.adminRepo.count();
    }
    async myprofie(email) {
        const data = await this.adminRepo.findOne({ where: { email } });
        if (data !== null) {
            const { id, password } = data, filteredData = __rest(data, ["id", "password"]);
            return filteredData;
        }
        else {
            throw new common_1.HttpException('Not Found', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async getAdminById(id) {
        const data = await this.adminRepo.findOne({ where: { id } });
        if (data !== null) {
            const { id, password } = data, filteredData = __rest(data, ["id", "password"]);
            return filteredData;
        }
        else {
            throw new common_1.HttpException('Not Found', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async getAdminByName(username) {
        const data = await this.adminRepo.findOne({ where: { username } });
        if (data !== null) {
            const { id, password } = data, filteredData = __rest(data, ["id", "password"]);
            return filteredData;
        }
        else {
            throw new common_1.HttpException('Not Found', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async getAdminByEmail(email) {
        const data = await this.adminRepo.findOne({ where: { email } });
        if (data !== null) {
            const { id, password } = data, filteredData = __rest(data, ["id", "password"]);
            return filteredData;
        }
        else {
            throw new common_1.HttpException('Not Found', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async addAdmin(mydto) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(mydto.password, salt);
        mydto.password = hashedPassword;
        const existingAdminEmail = await this.adminRepo.findOne({ where: { email: mydto.email } });
        if (mydto.username === '') {
            throw new common_1.HttpException({ message: "Please provide the username" }, common_1.HttpStatus.BAD_REQUEST);
        }
        else if (mydto.email === '') {
            throw new common_1.HttpException({ message: "Please provide the email" }, common_1.HttpStatus.BAD_REQUEST);
        }
        else if (mydto.password === '') {
            throw new common_1.HttpException({ message: "Please provide the password" }, common_1.HttpStatus.BAD_REQUEST);
        }
        else if (mydto.address === '') {
            throw new common_1.HttpException({ message: "Please provide the address" }, common_1.HttpStatus.BAD_REQUEST);
        }
        else if (existingAdminEmail) {
            throw new common_1.HttpException({ message: "Email already exists" }, common_1.HttpStatus.BAD_REQUEST);
        }
        else {
            await this.adminRepo.save(mydto);
            throw new common_1.HttpException('New Admin Added', common_1.HttpStatus.OK);
        }
    }
    async updateAdmin(mydto, email) {
        if (mydto.username === '') {
            throw new common_1.HttpException({ message: "Please provide the username" }, common_1.HttpStatus.BAD_REQUEST);
        }
        else {
            const changes = { username: mydto.username, address: mydto.address };
            if (mydto.password && !(0, demo_1.isDemoAccount)(email)) {
                changes.password = await bcrypt.hash(mydto.password, await bcrypt.genSalt());
            }
            await this.adminRepo.update({ email }, changes);
            throw new common_1.HttpException('Admin Updated', common_1.HttpStatus.OK);
        }
    }
    updateAdminbyId(mydto, id) {
        return this.adminRepo.update(id, mydto);
    }
    async deleteAdminbyId(id) {
        const admin = await this.adminRepo.findOne({ where: { id } });
        if (admin && (0, demo_1.isDemoAccount)(admin.email)) {
            throw new common_1.ForbiddenException({ message: "The demo account can't be deleted" });
        }
        return this.adminRepo.delete(id);
    }
    async signin(mydto) {
        if (mydto.email != null && mydto.password != null) {
            const mydata = await this.adminRepo.findOneBy({ email: mydto.email });
            if (!mydata) {
                throw new common_1.UnauthorizedException({ message: "Email didn't match" });
            }
            const isMatch = await bcrypt.compare(mydto.password, mydata.password);
            if (isMatch) {
                return mydata;
            }
            else {
                return false;
            }
        }
        else {
            throw new common_1.UnauthorizedException({ message: "invalid credentials" });
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
        }
        catch (error) {
            throw new Error(`Error sending email: ${error.message}`);
        }
    }
};
AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(admin_entity_1.Admin)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        mail_service_1.MailService])
], AdminService);
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map