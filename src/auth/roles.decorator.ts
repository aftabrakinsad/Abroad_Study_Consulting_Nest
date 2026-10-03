import { SetMetadata } from '@nestjs/common';

export type Role = 'admin' | 'manager' | 'consultant' | 'user';

export const ROLES_KEY = 'roles';
// Restricts a controller or route to the given roles; checked by JwtAuthGuard
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
