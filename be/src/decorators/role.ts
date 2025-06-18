// auth/decorators/roles.decorator.ts
import { UserRole } from '@consts';
import { RoleGuard } from '@guards/role.guard';
import { SetMetadata, UseGuards } from '@nestjs/common';

export const Roles = (roles: UserRole[]) => {
  return (
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    SetMetadata('roles', roles)(target, key, descriptor);
    UseGuards(RoleGuard)(target, key, descriptor);
  };
};
