"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagerModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const manager_entity_1 = require("../entities/manager.entity");
const mailer_1 = require("@nestjs-modules/mailer");
const manager_service_1 = require("./manager.service");
let ManagerModule = class ManagerModule {
};
ManagerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mailer_1.MailerModule.forRoot({
                transport: {
                    host: 'smtp.gmail.com',
                    port: 465,
                    ignoreTLS: true,
                    secure: true,
                    auth: {
                        user: 'rakinsadaftab@gmail.com',
                        pass: 'rvaxlwlwfhbztjbm',
                    },
                }
            }),
            typeorm_1.TypeOrmModule.forFeature([manager_entity_1.Manager])
        ],
        controllers: [],
        providers: [manager_service_1.ManagerService],
    })
], ManagerModule);
exports.ManagerModule = ManagerModule;
//# sourceMappingURL=manager.module.js.map