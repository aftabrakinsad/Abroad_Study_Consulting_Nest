import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
import { ManagerModule } from './manager/manager.module';
import { ConsultantModule } from './consultant/consultant.module';
import { MailModule } from './mail/mail.module';
import { StudentModule } from './student/student.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const ssl = process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false;
        // Hosted providers (Neon, Render, Supabase) hand out a single connection string
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
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'dev-only-secret',
      signOptions: { expiresIn: '1d' },
    }),
    MailModule,
    AdminModule,
    ManagerModule,
    ConsultantModule,
    StudentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
