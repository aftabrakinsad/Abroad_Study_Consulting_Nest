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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultantController = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const manager_service_1 = require("../manager/manager.service");
const consultant_service_1 = require("./consultant.service");
const Consultant_dto_1 = require("../dtos/Consultant.dto");
const application_service_1 = require("../student/application.service");
let ConsultantController = class ConsultantController {
    constructor(consultantService, managerService, jwtService, applicationService) {
        this.consultantService = consultantService;
        this.managerService = managerService;
        this.jwtService = jwtService;
        this.applicationService = applicationService;
    }
    async signin(mydto) {
        const consultant = await this.consultantService.signin(mydto);
        if (!consultant) {
            throw new common_1.UnauthorizedException({ message: "invalid credentials" });
        }
        const token = await this.jwtService.signAsync({ sub: consultant.id, email: consultant.email, role: 'consultant' });
        return { message: "Login Successful!", token, email: consultant.email, name: consultant.name, role: 'consultant' };
    }
    signout() {
        return { message: "You are logged out" };
    }
    getProfile(req) {
        return this.consultantService.con_profie(req.user.email);
    }
    updateProfile(req, mydto) {
        return this.consultantService.updateProfile(req.user.email, mydto);
    }
    getManagers() {
        return this.managerService.getManagers();
    }
    getApplications(req) {
        return this.applicationService.getForConsultant(req.user.sub);
    }
    updateApplication(req, id, mydto) {
        return this.applicationService.updateStatus(id, req.user.sub, mydto);
    }
    async sendEmail(mydata) {
        const result = await this.consultantService.Email(mydata);
        const message = result.simulated
            ? 'Email simulated (sending is disabled in the demo)'
            : 'Email sent successfully';
        return { message, result };
    }
};
__decorate([
    (0, common_1.Post)('/signin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Consultant_dto_1.ConsultantDto]),
    __metadata("design:returntype", Promise)
], ConsultantController.prototype, "signin", null);
__decorate([
    (0, common_1.Post)('/signout'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConsultantController.prototype, "signout", null);
__decorate([
    (0, common_1.Get)('/profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], ConsultantController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)('/profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Object)
], ConsultantController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)('/managers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], ConsultantController.prototype, "getManagers", null);
__decorate([
    (0, common_1.Get)('/applications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], ConsultantController.prototype, "getApplications", null);
__decorate([
    (0, common_1.Put)('/applications/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Object)
], ConsultantController.prototype, "updateApplication", null);
__decorate([
    (0, common_1.Post)('/email'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConsultantController.prototype, "sendEmail", null);
ConsultantController = __decorate([
    (0, common_1.Controller)('consultant'),
    (0, roles_decorator_1.Roles)('consultant'),
    __metadata("design:paramtypes", [consultant_service_1.ConsultantService,
        manager_service_1.ManagerService,
        jwt_1.JwtService,
        application_service_1.ApplicationService])
], ConsultantController);
exports.ConsultantController = ConsultantController;
//# sourceMappingURL=consultant.controller.js.map