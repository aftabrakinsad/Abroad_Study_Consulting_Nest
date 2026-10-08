import { Body, Controller, Get, Post, Put, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { StudentService } from './student.service';
import { ApplicationService } from './application.service';

// Users (students) are the only accounts that can register themselves
@Controller('user')
@Roles('user')
export class StudentController {
    constructor(
        private studentService: StudentService,
        private applicationService: ApplicationService,
        private jwtService: JwtService,
    ) { }

    @Post('/signup')
    signup(@Body() mydto) {
        return this.studentService.signup(mydto);
    }

    @Post('/signin')
    async signin(@Body() mydto) {
        const student = await this.studentService.signin(mydto);
        if (!student)
        {
            throw new UnauthorizedException({ message: "invalid credentials" });
        }
        const token = await this.jwtService.signAsync({ sub: student.id, email: student.email, role: 'user' });
        return { message: "Login Successful!", token, email: student.email, name: student.name, role: 'user' };
    }

    // JWTs are stateless: the client signs out by discarding its token
    @Post('/signout')
    signout() {
        return { message: "You are logged out" };
    }

    @Get('/profile')
    @UseGuards(JwtAuthGuard)
    getProfile(@Req() req) {
        return this.studentService.profile(req.user.email);
    }

    @Put('/profile')
    @UseGuards(JwtAuthGuard)
    updateProfile(@Req() req, @Body() mydto) {
        return this.studentService.updateProfile(req.user.email, mydto);
    }

    @Get('/applications')
    @UseGuards(JwtAuthGuard)
    getApplications(@Req() req) {
        return this.applicationService.getForStudent(req.user.sub);
    }

    @Post('/applications')
    @UseGuards(JwtAuthGuard)
    apply(@Req() req, @Body() mydto) {
        return this.applicationService.create(req.user.sub, mydto);
    }
}
