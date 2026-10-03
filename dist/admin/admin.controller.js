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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const exceptions_1 = require("@nestjs/common/exceptions");
const manager_service_1 = require("../manager/manager.service");
const admin_update_dto_1 = require("../dtos/admin-update.dto");
const admin_service_1 = require("./admin.service");
const admin_dto_1 = require("../dtos/admin.dto");
const manager_dto_1 = require("../dtos/manager.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const Consultant_dto_1 = require("../dtos/Consultant.dto");
const consultant_service_1 = require("../consultant/consultant.service");
const manager_update_dto_1 = require("../dtos/manager-update.dto");
const consultant_update_dtp_1 = require("../dtos/consultant-update.dtp");
const student_service_1 = require("../student/student.service");
const application_service_1 = require("../student/application.service");
let AdminController = class AdminController {
    constructor(adminService, managerService, consultantService, jwtService, studentService, applicationService) {
        this.adminService = adminService;
        this.managerService = managerService;
        this.consultantService = consultantService;
        this.jwtService = jwtService;
        this.studentService = studentService;
        this.applicationService = applicationService;
    }
    requireMaster(req) {
        if (!req.user.master) {
            throw new exceptions_1.ForbiddenException({ message: "Only the master admin can manage admins" });
        }
    }
    getAdmin() {
        return this.adminService.getIndex();
    }
    getManagers() {
        return this.managerService.getManagers();
    }
    getConsultants() {
        return this.consultantService.getConsultants();
    }
    getAdminStatistics() {
        return this.adminService.getTotalAdmins();
    }
    getManagerStatistics() {
        return this.managerService.getTotalManagers();
    }
    getConsultantStatistics() {
        return this.consultantService.getTotalConsultants();
    }
    getProfile(req) {
        return this.adminService.myprofie(req.user.email);
    }
    getUserStatistics() {
        return this.studentService.getTotalStudents();
    }
    getApplicationStatistics() {
        return this.applicationService.getTotal();
    }
    getUsers() {
        return this.studentService.getStudents();
    }
    getUserByID(id) {
        return this.studentService.getStudentById(id);
    }
    deleteUser(id) {
        return this.studentService.deleteStudent(id);
    }
    getApplications() {
        return this.applicationService.getAll();
    }
    assignApplication(id, consultantId) {
        return this.applicationService.assign(id, consultantId);
    }
    getAdminByID(id) {
        return this.adminService.getAdminById(id);
    }
    getConsultantByID(id) {
        return this.consultantService.getConsultantById(id);
    }
    getManagerByID(id) {
        return this.managerService.getManagerById(id);
    }
    getAdminByName(username) {
        return this.adminService.getAdminByName(username);
    }
    getAdminByEmail(email) {
        return this.adminService.getAdminByEmail(email);
    }
    async updateAdmin(req, adminDto) {
        return this.adminService.updateAdmin(adminDto, req.user.email);
    }
    updateManager(req, name) {
        return this.managerService.updateManager(name, req.user.email);
    }
    updateConsultant(req, name) {
        return this.consultantService.updateConsultant(name, req.user.email);
    }
    updateAdminbyid(req, mydto, id) {
        this.requireMaster(req);
        return this.adminService.updateAdminbyId(mydto, id);
    }
    updateManagerbyid(mydto, id) {
        return this.managerService.updateManagerbyId(mydto, id);
    }
    updateConsultantbyid(mydto, id) {
        return this.consultantService.updateConsultantbyid(mydto, id);
    }
    deleteAdminbyId(req, id) {
        this.requireMaster(req);
        return this.adminService.deleteAdminbyId(id);
    }
    deleteManagerId(id) {
        return this.managerService.deleteManagerbyId(id);
    }
    deleteConsultantId(id) {
        return this.consultantService.deleteConsultantId(id);
    }
    async addAdmin(req, admindto) {
        this.requireMaster(req);
        return this.adminService.addAdmin(admindto);
    }
    async addManager(managerDto) {
        return this.managerService.addManager(managerDto);
    }
    async addConsultant(consultantDto) {
        return this.consultantService.addConsultant(consultantDto);
    }
    async signin(mydto) {
        const admin = await this.adminService.signin(mydto);
        if (admin) {
            const token = await this.jwtService.signAsync({ sub: admin.id, email: admin.email, role: 'admin', master: admin.isMaster });
            return { message: "Login Successful!", token, email: admin.email, name: admin.username, role: 'admin', master: admin.isMaster };
        }
        else {
            throw new exceptions_1.UnauthorizedException({ message: "invalid credentials" });
        }
    }
    signout() {
        return { message: "You are logged out" };
    }
    async sendEmail(mydata) {
        try {
            const result = await this.adminService.sendEmail(mydata);
            const message = result.simulated
                ? 'Email simulated (sending is disabled in the demo)'
                : 'Email sent successfully';
            return { message, result };
        }
        catch (error) {
            return { message: 'Failed to send email', error: error.message };
        }
    }
};
__decorate([
    (0, common_1.Get)('/index'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AdminController.prototype, "getAdmin", null);
__decorate([
    (0, common_1.Get)('/managers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AdminController.prototype, "getManagers", null);
__decorate([
    (0, common_1.Get)('/consultants'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AdminController.prototype, "getConsultants", null);
__decorate([
    (0, common_1.Get)('/adminCount'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AdminController.prototype, "getAdminStatistics", null);
__decorate([
    (0, common_1.Get)('/managerCount'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AdminController.prototype, "getManagerStatistics", null);
__decorate([
    (0, common_1.Get)('/consultantCount'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AdminController.prototype, "getConsultantStatistics", null);
__decorate([
    (0, common_1.Get)('/profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], AdminController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('/userCount'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AdminController.prototype, "getUserStatistics", null);
__decorate([
    (0, common_1.Get)('/applicationCount'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AdminController.prototype, "getApplicationStatistics", null);
__decorate([
    (0, common_1.Get)('/users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AdminController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)('/user/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Object)
], AdminController.prototype, "getUserByID", null);
__decorate([
    (0, common_1.Delete)('/deleteUser/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Object)
], AdminController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Get)('/applications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AdminController.prototype, "getApplications", null);
__decorate([
    (0, common_1.Put)('/applications/:id/assign'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('consultantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Object)
], AdminController.prototype, "assignApplication", null);
__decorate([
    (0, common_1.Get)('/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Object)
], AdminController.prototype, "getAdminByID", null);
__decorate([
    (0, common_1.Get)('/consultant/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Object)
], AdminController.prototype, "getConsultantByID", null);
__decorate([
    (0, common_1.Get)('/manager/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Object)
], AdminController.prototype, "getManagerByID", null);
__decorate([
    (0, common_1.Get)('username/:username'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], AdminController.prototype, "getAdminByName", null);
__decorate([
    (0, common_1.Get)('/email/:email'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], AdminController.prototype, "getAdminByEmail", null);
__decorate([
    (0, common_1.Put)('/updateAdmin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, admin_dto_1.AdminDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateAdmin", null);
__decorate([
    (0, common_1.Put)('/updateManager/'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Object)
], AdminController.prototype, "updateManager", null);
__decorate([
    (0, common_1.Put)('/updateConsultant/'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Object)
], AdminController.prototype, "updateConsultant", null);
__decorate([
    (0, common_1.Put)('/updateAdmin/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, admin_update_dto_1.AdminUpdateDto, Number]),
    __metadata("design:returntype", Object)
], AdminController.prototype, "updateAdminbyid", null);
__decorate([
    (0, common_1.Put)('/updateManager/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [manager_update_dto_1.ManagerUpdateDto, Number]),
    __metadata("design:returntype", Object)
], AdminController.prototype, "updateManagerbyid", null);
__decorate([
    (0, common_1.Put)('/updateConsultant/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [consultant_update_dtp_1.CounsultantUpdateDto, Number]),
    __metadata("design:returntype", Object)
], AdminController.prototype, "updateConsultantbyid", null);
__decorate([
    (0, common_1.Delete)('/deleteAdmin/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Object)
], AdminController.prototype, "deleteAdminbyId", null);
__decorate([
    (0, common_1.Delete)('/deleteManager/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Object)
], AdminController.prototype, "deleteManagerId", null);
__decorate([
    (0, common_1.Delete)('/deleteConsultant/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Object)
], AdminController.prototype, "deleteConsultantId", null);
__decorate([
    (0, common_1.Post)('/addAdmin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, admin_dto_1.AdminDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addAdmin", null);
__decorate([
    (0, common_1.Post)('/addManager'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [manager_dto_1.ManagerDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addManager", null);
__decorate([
    (0, common_1.Post)('/addConsultant'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Consultant_dto_1.ConsultantDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addConsultant", null);
__decorate([
    (0, common_1.Post)('/signin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_1.AdminDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "signin", null);
__decorate([
    (0, common_1.Post)('/signout'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "signout", null);
__decorate([
    (0, common_1.Post)('/send-email'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "sendEmail", null);
AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        manager_service_1.ManagerService,
        consultant_service_1.ConsultantService,
        jwt_1.JwtService,
        student_service_1.StudentService,
        application_service_1.ApplicationService])
], AdminController);
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map