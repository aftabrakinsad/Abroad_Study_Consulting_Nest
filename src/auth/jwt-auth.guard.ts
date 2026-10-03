import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Role, ROLES_KEY } from './roles.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const [type, token] = (request.headers.authorization || '').split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException({ message: 'Please sign in' });
    }
    try {
      request.user = await this.jwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException({ message: 'Session expired, please sign in again' });
    }

    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (roles && !roles.includes(request.user.role)) {
      throw new ForbiddenException({ message: "You don't have access to this page" });
    }
    return true;
  }
}
