import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { ManagerService } from '../manager/manager.service';
import { ConsultantService } from './consultant.service';
import { ConsultantDto } from '../dtos/Consultant.dto';
import { ApplicationService } from '../student/application.service';

@Controller('consultant')
@Roles('consultant')
export class ConsultantController {
    constructor(
        private consultantService: ConsultantService,
        private managerService: ManagerService,
        private jwtService: JwtService,
        private applicationService: ApplicationService,
    ) { }

    @Post('/signin')
    async signin(@Body() mydto: ConsultantDto) {
      const consultant = await this.consultantService.signin(mydto);
      if (!consultant)
      {
        throw new UnauthorizedException({ message: "invalid credentials" });
      }
      const token = await this.jwtService.signAsync({ sub: consultant.id, email: consultant.email, role: 'consultant' });
      return { message: "Login Successful!", token, email: consultant.email, name: consultant.name, role: 'consultant' };
    }

    // JWTs are stateless: the client signs out by discarding its token
    @Post('/signout')
    signout() {
      return { message: "You are logged out" };
    }

    @Get('/profile')
    @UseGuards(JwtAuthGuard)
    getProfile(@Req() req): any {
      return this.consultantService.con_profie(req.user.email);
    }

    @Put('/profile')
    @UseGuards(JwtAuthGuard)
    updateProfile(@Req() req, @Body() mydto): any {
      return this.consultantService.updateProfile(req.user.email, mydto);
    }

    // Consultants can look up the managers they report to
    @Get('/managers')
    @UseGuards(JwtAuthGuard)
    getManagers(): any {
      return this.managerService.getManagers();
    }

    @Get('/applications')
    @UseGuards(JwtAuthGuard)
    getApplications(@Req() req): any {
      return this.applicationService.getForConsultant(req.user.sub);
    }

    @Put('/applications/:id')
    @UseGuards(JwtAuthGuard)
    updateApplication(@Req() req, @Param('id', ParseIntPipe) id: number, @Body() mydto): any {
      return this.applicationService.updateStatus(id, req.user.sub, mydto);
    }

    @Post('/email')
    @UseGuards(JwtAuthGuard)
    async sendEmail(@Body() mydata) {
      const result = await this.consultantService.Email(mydata);
      const message = result.simulated
        ? 'Email simulated (sending is disabled in the demo)'
        : 'Email sent successfully';
      return { message, result };
    }
}
