"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const admin_module_1 = require("./admin/admin.module");
const manager_module_1 = require("./manager/manager.module");
const consultant_module_1 = require("./consultant/consultant.module");
const mail_module_1 = require("./mail/mail.module");
const student_module_1 = require("./student/student.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: () => {
                    const ssl = process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false;
                    if (process.env.DATABASE_URL) {
                        return {
                            type: 'postgres',
                            url: process.env.DATABASE_URL,
                            ssl,
                            autoLoadEntities: true,
                            synchronize: true,
                        };
                    }
                    return {
                        type: 'postgres',
                        host: process.env.DB_HOST || 'localhost',
                        port: parseInt(process.env.DB_PORT || '5432', 10),
                        username: process.env.DB_USERNAME || 'postgres',
                        password: process.env.DB_PASSWORD,
                        database: process.env.DB_DATABASE || 'APWTDB',
                        ssl,
                        autoLoadEntities: true,
                        synchronize: true,
                    };
                },
            }),
            jwt_1.JwtModule.register({
                global: true,
                secret: process.env.JWT_SECRET || 'dev-only-secret',
                signOptions: { expiresIn: '1d' },
            }),
            mail_module_1.MailModule,
            admin_module_1.AdminModule,
            manager_module_1.ManagerModule,
            consultant_module_1.ConsultantModule,
            student_module_1.StudentModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map