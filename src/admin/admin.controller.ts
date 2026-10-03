import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
  UseGuards,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ForbiddenException, HttpException, UnauthorizedException } from '@nestjs/common/exceptions';
import { ManagerService } from 'src/manager/manager.service';
import { AdminUpdateDto } from '../dtos/admin-update.dto';
import { AdminService } from './admin.service';
import { AdminDto } from '../dtos/admin.dto';
import { ManagerDto } from 'src/dtos/manager.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ConsultantDto } from 'src/dtos/Consultant.dto';
import { ConsultantService } from 'src/consultant/consultant.service';
import { ManagerUpdateDto } from 'src/dtos/manager-update.dto';
import { CounsultantUpdateDto } from 'src/dtos/consultant-update.dtp';
import { StudentService } from 'src/student/student.service';
import { ApplicationService } from 'src/student/application.service';

@Controller('admin')
@Roles('admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private managerService: ManagerService,
    private consultantService: ConsultantService,
    private jwtService: JwtService,
    private studentService: StudentService,
    private applicationService: ApplicationService,
  ) { }

  // Only the master admin may create, edit or delete admins
  private requireMaster(req) {
    if (!req.user.master) {
      throw new ForbiddenException({ message: "Only the master admin can manage admins" });
    }
  }

  @Get('/index')
  @UseGuards(JwtAuthGuard)
  getAdmin(): any {
    return this.adminService.getIndex();
  }

  @Get('/managers')
  @UseGuards(JwtAuthGuard)
  getManagers(): any {
    return this.managerService.getManagers();
  }

  @Get('/consultants')
  @UseGuards(JwtAuthGuard)
  getConsultants(): any {
    return this.consultantService.getConsultants();
  }

  @Get('/adminCount')
  @UseGuards(JwtAuthGuard)
  getAdminStatistics(): any {
    return this.adminService.getTotalAdmins();
  }

  @Get('/managerCount')
  @UseGuards(JwtAuthGuard)
  getManagerStatistics(): any {
    return this.managerService.getTotalManagers();
  }

  @Get('/consultantCount')
  @UseGuards(JwtAuthGuard)
  getConsultantStatistics(): any {
    return this.consultantService.getTotalConsultants();
  }
  
  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req): any {
    return this.adminService.myprofie(req.user.email);
  }
  
  @Get('/userCount')
  @UseGuards(JwtAuthGuard)
  getUserStatistics(): any {
    return this.studentService.getTotalStudents();
  }

  @Get('/applicationCount')
  @UseGuards(JwtAuthGuard)
  getApplicationStatistics(): any {
    return this.applicationService.getTotal();
  }

  @Get('/users')
  @UseGuards(JwtAuthGuard)
  getUsers(): any {
    return this.studentService.getStudents();
  }

  @Get('/user/:id')
  @UseGuards(JwtAuthGuard)
  getUserByID(@Param('id', ParseIntPipe) id: number): any {
    return this.studentService.getStudentById(id);
  }

  @Delete('/deleteUser/:id')
  @UseGuards(JwtAuthGuard)
  deleteUser(@Param('id', ParseIntPipe) id: number): any {
    return this.studentService.deleteStudent(id);
  }

  @Get('/applications')
  @UseGuards(JwtAuthGuard)
  getApplications(): any {
    return this.applicationService.getAll();
  }

  @Put('/applications/:id/assign')
  @UseGuards(JwtAuthGuard)
  assignApplication(@Param('id', ParseIntPipe) id: number, @Body('consultantId') consultantId): any {
    return this.applicationService.assign(id, consultantId);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  getAdminByID(@Param('id', ParseIntPipe) id: number): any {
    return this.adminService.getAdminById(id);
  }

  @Get('/consultant/:id')
  @UseGuards(JwtAuthGuard)
  getConsultantByID(@Param('id', ParseIntPipe) id: number): any {
    return this.consultantService.getConsultantById(id);
  }

  @Get('/manager/:id')
  @UseGuards(JwtAuthGuard)
  getManagerByID(@Param('id', ParseIntPipe) id: number): any {
    return this.managerService.getManagerById(id);
  }

  @Get('username/:username')
  @UseGuards(JwtAuthGuard)
  getAdminByName(@Param('username') username: string): any {
    return this.adminService.getAdminByName(username);
  }

  @Get('/email/:email')
  @UseGuards(JwtAuthGuard)
  getAdminByEmail(@Param('email') email: string): any {
    return this.adminService.getAdminByEmail(email);
  }

  // @Put('/updateAdmin/')
  // @UseGuards(SessionGuard)
  // @UsePipes(new ValidationPipe())
  // async updateAdmin(@Session() session, @Body('username') username: string): Promise<any> {
    // console.log(session.email);
  //   return this.adminService.updateAdmin(username);
  // }

  @Put('/updateAdmin')
  @UseGuards(JwtAuthGuard)
  // @UsePipes(new ValidationPipe())
  async updateAdmin(@Req() req, @Body() adminDto: AdminDto): Promise<any> {
      return this.adminService.updateAdmin(adminDto, req.user.email);
  }

  @Put('/updateManager/')
  @UseGuards(JwtAuthGuard)
  // @UsePipes(new ValidationPipe())
  updateManager(@Req() req, @Body('name') name: string): any {
    return this.managerService.updateManager(name, req.user.email);
  }

  @Put('/updateConsultant/')
  @UseGuards(JwtAuthGuard)
  // @UsePipes(new ValidationPipe())
  updateConsultant(@Req() req, @Body('name') name: string): any {
    return this.consultantService.updateConsultant(name, req.user.email);
  }

  @Put('/updateAdmin/:id')
  @UseGuards(JwtAuthGuard)
  // @UsePipes(new ValidationPipe())
  updateAdminbyid(@Req() req, @Body() mydto: AdminUpdateDto, @Param('id', ParseIntPipe) id: number): any {
    this.requireMaster(req);
    return this.adminService.updateAdminbyId(mydto, id);
  }

  @Put('/updateManager/:id')
  @UseGuards(JwtAuthGuard)
  // @UsePipes(new ValidationPipe())
  updateManagerbyid(@Body() mydto: ManagerUpdateDto, @Param('id', ParseIntPipe) id: number): any {
    return this.managerService.updateManagerbyId(mydto, id);
  }

  @Put('/updateConsultant/:id')
  @UseGuards(JwtAuthGuard)
  // @UsePipes(new ValidationPipe())
  updateConsultantbyid(@Body() mydto: CounsultantUpdateDto, @Param('id', ParseIntPipe) id: number): any {
    return this.consultantService.updateConsultantbyid(mydto, id);
  }

  @Delete('/deleteAdmin/:id')
  @UseGuards(JwtAuthGuard)
  deleteAdminbyId(@Req() req, @Param('id', ParseIntPipe) id: number): any {
    this.requireMaster(req);
    return this.adminService.deleteAdminbyId(id);
  }

  @Delete('/deleteManager/:id')
  @UseGuards(JwtAuthGuard)
  deleteManagerId(@Param('id', ParseIntPipe) id: number): any {
    return this.managerService.deleteManagerbyId(id);
  }

  @Delete('/deleteConsultant/:id')
  @UseGuards(JwtAuthGuard)
  deleteConsultantId(@Param('id', ParseIntPipe) id: number): any {
    return this.consultantService.deleteConsultantId(id);
  }

  @Post('/addAdmin')
  @UseGuards(JwtAuthGuard)
  // @UsePipes(new ValidationPipe())
  async addAdmin(@Req() req, @Body() admindto: AdminDto): Promise<any>
  {
    this.requireMaster(req);
    // console.log(mydto)
    return this.adminService.addAdmin(admindto);
  }
  
  @Post('/addManager')
  @UseGuards(JwtAuthGuard)
  // @UsePipes(new ValidationPipe())
  async addManager(@Body() managerDto: ManagerDto): Promise<any> {
      return this.managerService.addManager(managerDto);
  }

  @Post('/addConsultant')
  @UseGuards(JwtAuthGuard)
  // @UsePipes(new ValidationPipe())
  async addConsultant(@Body() consultantDto: ConsultantDto): Promise<any> {
      return this.consultantService.addConsultant(consultantDto);
  }
   
  // @Get('/managersbyAdmin/:id')
  // getManagerByAdminId(@Param('id', ParseIntPipe) id: number): any {
  //   return this.adminService.ManagersByAdminId(id);
  // }
  
  // @Get('/adminbyManager/:id')
  // @UseGuards(SessionGuard)
  // getAdminByManagerId(@Param('id', ParseIntPipe) id: number): any {
  //   return this.managerService.getAdminByManagerID(id);
  // }
   

  @Post('/signin')
  // @UsePipes(new ValidationPipe())
  async signin(@Body() mydto: AdminDto) {
    const admin = await this.adminService.signin(mydto);
    if (admin)
    {
      const token = await this.jwtService.signAsync({ sub: admin.id, email: admin.email, role: 'admin', master: admin.isMaster });
      return { message: "Login Successful!", token, email: admin.email, name: admin.username, role: 'admin', master: admin.isMaster };
    }
    else
    {
      throw new UnauthorizedException({ message: "invalid credentials" });
    }
  }

  // JWTs are stateless: the client signs out by discarding its token
  @Post('/signout')
  signout() {
    return { message: "You are logged out" };
  }

  @Post('/send-email')
  @UseGuards(JwtAuthGuard)
  async sendEmail(@Body() mydata) {
    try {
      const result = await this.adminService.sendEmail(mydata);
      const message = result.simulated
        ? 'Email simulated (sending is disabled in the demo)'
        : 'Email sent successfully';
      return { message, result };
    } catch (error) {
      return { message: 'Failed to send email', error: error.message };
    }
  }
}