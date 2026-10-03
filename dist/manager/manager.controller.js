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
exports.ManagerController = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const consultant_service_1 = require("../consultant/consultant.service");
const manager_service_1 = require("./manager.service");
const manager_dto_1 = require("../dtos/manager.dto");
const application_service_1 = require("../student/application.service");
let ManagerController = class ManagerController {
    constructor(managerService, consultantService, jwtService, applicationService) {
        this.managerService = managerService;
        this.consultantService = consultantService;
        this.jwtService = jwtService;
        this.applicationService = applicationService;
    }
    async signin(mydto) {
        const manager = await this.managerService.signin(mydto);
        if (!manager) {
            throw new common_1.UnauthorizedException({ message: "invalid credentials" });
        }
        const token = await this.jwtService.signAsync({ sub: manager.id, email: manager.email, role: 'manager' });
        return { message: "Login Successful!", token, email: manager.email, name: manager.name, role: 'manager' };
    }
    signout() {
        return { message: "You are logged out" };
    }
    getProfile(req) {
        return this.managerService.manager_profie(req.user.email);
    }
    updateProfile(req, mydto) {
        return this.managerService.updateProfile(req.user.email, mydto);
    }
    getConsultants() {
        return this.consultantService.getConsultants();
    }
    getApplications() {
        return this.applicationService.getAll();
    }
    assignApplication(id, consultantId) {
        return this.applicationService.assign(id, consultantId);
    }
    async sendEmail(mydata) {
        const result = await this.managerService.Email(mydata);
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
    __metadata("design:paramtypes", [manager_dto_1.ManagerDto]),
    __metadata("design:returntype", Promise)
], ManagerController.prototype, "signin", null);
__decorate([
    (0, common_1.Post)('/signout'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ManagerController.prototype, "signout", null);
__decorate([
    (0, common_1.Get)('/profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], ManagerController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)('/profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Object)
], ManagerController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)('/consultants'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], ManagerController.prototype, "getConsultants", null);
__decorate([
    (0, common_1.Get)('/applications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], ManagerController.prototype, "getApplications", null);
__decorate([
    (0, common_1.Put)('/applications/:id/assign'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('consultantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Object)
], ManagerController.prototype, "assignApplication", null);
__decorate([
    (0, common_1.Post)('/email'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ManagerController.prototype, "sendEmail", null);
ManagerController = __decorate([
    (0, common_1.Controller)('manager'),
    (0, roles_decorator_1.Roles)('manager'),
    __metadata("design:paramtypes", [manager_service_1.ManagerService,
        consultant_service_1.ConsultantService,
        jwt_1.JwtService,
        application_service_1.ApplicationService])
], ManagerController);
exports.ManagerController = ManagerController;
//# sourceMappingURL=manager.controller.js.map