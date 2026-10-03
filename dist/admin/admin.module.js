"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const student_module_1 = require("../student/student.module");
const typeorm_1 = require("@nestjs/typeorm");
const admin_controller_1 = require("./admin.controller");
const admin_service_1 = require("./admin.service");
const admin_entity_1 = require("../entities/admin.entity");
const manager_service_1 = require("../manager/manager.service");
const manager_entity_1 = require("../entities/manager.entity");
const consultant_service_1 = require("../consultant/consultant.service");
const consultant_entity_1 = require("../entities/consultant.entity");
const demo_seed_service_1 = require("../seed/demo-seed.service");
const student_entity_1 = require("../entities/student.entity");
const application_entity_1 = require("../entities/application.entity");
let AdminModule = class AdminModule {
};
AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [student_module_1.StudentModule, typeorm_1.TypeOrmModule.forFeature([admin_entity_1.Admin, manager_entity_1.Manager, consultant_entity_1.Consultant, student_entity_1.Student, application_entity_1.Application])],
        controllers: [admin_controller_1.AdminController],
        providers: [admin_service_1.AdminService, manager_service_1.ManagerService, consultant_service_1.ConsultantService, demo_seed_service_1.DemoSeedService],
    })
], AdminModule);
exports.AdminModule = AdminModule;
//# sourceMappingURL=admin.module.js.map