import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ConsultantService } from 'src/consultant/consultant.service';
import { ManagerService } from './manager.service';
import { ManagerDto } from 'src/dtos/manager.dto';
import { ApplicationService } from 'src/student/application.service';

@Controller('manager')
@Roles('manager')
export class ManagerController {
    constructor(
        private managerService: ManagerService,
        private consultantService: ConsultantService,
        private jwtService: JwtService,
        private applicationService: ApplicationService,
    ) { }

    @Post('/signin')
    async signin(@Body() mydto: ManagerDto) {
        const manager = await this.managerService.signin(mydto);
        if (!manager)
        {
            throw new UnauthorizedException({ message: "invalid credentials" });
        }
        const token = await this.jwtService.signAsync({ sub: manager.id, email: manager.email, role: 'manager' });
        return { message: "Login Successful!", token, email: manager.email, name: manager.name, role: 'manager' };
    }

    // JWTs are stateless: the client signs out by discarding its token
    @Post('/signout')
    signout() {
        return { message: "You are logged out" };
    }

    @Get('/profile')
    @UseGuards(JwtAuthGuard)
    getProfile(@Req() req): any {
        return this.managerService.manager_profie(req.user.email);
    }

    @Put('/profile')
    @UseGuards(JwtAuthGuard)
    updateProfile(@Req() req, @Body() mydto): any {
        return this.managerService.updateProfile(req.user.email, mydto);
    }

    // Managers oversee consultants, so they can see the team
    @Get('/consultants')
    @UseGuards(JwtAuthGuard)
    getConsultants(): any {
        return this.consultantService.getConsultants();
    }

    @Get('/applications')
    @UseGuards(JwtAuthGuard)
    getApplications(): any {
        return this.applicationService.getAll();
    }

    // Managers match each student application with a consultant
    @Put('/applications/:id/assign')
    @UseGuards(JwtAuthGuard)
    assignApplication(@Param('id', ParseIntPipe) id: number, @Body('consultantId') consultantId): any {
        return this.applicationService.assign(id, consultantId);
    }

    @Post('/email')
    @UseGuards(JwtAuthGuard)
    async sendEmail(@Body() mydata) {
        const result = await this.managerService.Email(mydata);
        const message = result.simulated
            ? 'Email simulated (sending is disabled in the demo)'
            : 'Email sent successfully';
        return { message, result };
    }
}
