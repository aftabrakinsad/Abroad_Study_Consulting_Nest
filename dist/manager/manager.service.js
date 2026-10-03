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
exports.ManagerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const manager_entity_1 = require("../entities/manager.entity");
const mail_service_1 = require("../mail/mail.service");
const bcrypt = require("bcryptjs");
const demo_1 = require("../auth/demo");
let ManagerService = class ManagerService {
    constructor(managerRepo, mailService) {
        this.managerRepo = managerRepo;
        this.mailService = mailService;
    }
    async getManagers() {
        const rows = await this.managerRepo.find({ order: { id: 'ASC' } });
        return rows.map((_a) => {
            var { password } = _a, row = __rest(_a, ["password"]);
            return row;
        });
    }
    async getManagerById(id) {
        const data = await this.managerRepo.findOne({ where: { id } });
        if (data !== null) {
            const { id, password } = data, filteredData = __rest(data, ["id", "password"]);
            return filteredData;
        }
        else {
            throw new common_1.HttpException('Not Found', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async manager_profie(email) {
        const data = await this.managerRepo.findOne({ where: { email } });
        if (data !== null) {
            const { password } = data, filteredData = __rest(data, ["password"]);
            return filteredData;
        }
        else {
            throw new common_1.HttpException('Not Found', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async getTotalManagers() {
        return this.managerRepo.count();
    }
    async addManager(mydto) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(mydto.password, salt);
        mydto.password = hashedPassword;
        const existingManagerEmail = await this.managerRepo.findOne({ where: { email: mydto.email } });
        if (mydto.name === '') {
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
        else if (existingManagerEmail) {
            throw new common_1.HttpException({ message: "Email already exists" }, common_1.HttpStatus.BAD_REQUEST);
        }
        else {
            await this.managerRepo.save(mydto);
            throw new common_1.HttpException('Manager Added Successful.', common_1.HttpStatus.OK);
        }
    }
    updateManager(name, email) {
        return this.managerRepo.update({ email: email }, { name: name });
    }
    updateManagerbyId(mydto, id) {
        return this.managerRepo.update(id, mydto);
    }
    async deleteManagerbyId(id) {
        const manager = await this.managerRepo.findOne({ where: { id } });
        if (manager && (0, demo_1.isDemoAccount)(manager.email)) {
            throw new common_1.ForbiddenException({ message: "The demo account can't be deleted" });
        }
        return this.managerRepo.delete(id);
    }
    async updateProfile(email, mydto) {
        if (!mydto.name || mydto.name.trim() === '') {
            throw new common_1.HttpException({ message: "Please provide the name" }, common_1.HttpStatus.BAD_REQUEST);
        }
        if (!mydto.address || mydto.address.trim() === '') {
            throw new common_1.HttpException({ message: "Please provide the address" }, common_1.HttpStatus.BAD_REQUEST);
        }
        const changes = { name: mydto.name, address: mydto.address };
        if (mydto.password && !(0, demo_1.isDemoAccount)(email)) {
            changes.password = await bcrypt.hash(mydto.password, await bcrypt.genSalt());
        }
        await this.managerRepo.update({ email }, changes);
        return { message: 'Profile updated' };
    }
    async signin(mydto) {
        if (mydto.email != null && mydto.password != null) {
            const mydata = await this.managerRepo.findOneBy({ email: mydto.email });
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
    async Email(mydata) {
        return await this.mailService.sendMail({
            to: mydata.email,
            subject: mydata.subject,
            text: mydata.text,
        });
    }
};
ManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(manager_entity_1.Manager)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        mail_service_1.MailService])
], ManagerService);
exports.ManagerService = ManagerService;
//# sourceMappingURL=manager.service.js.map