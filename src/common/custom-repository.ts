import { SetMetadata } from '@nestjs/common';

export const TYPEORM_CUSTOM_REPOSITORY = 'TYPEORM_CUTOM_REPOSITORY';

export function CustomRepository<T extends { new (...args: any[]): object }>(
  entity: T,
): ClassDecorator {
  return SetMetadata(TYPEORM_CUSTOM_REPOSITORY, entity);
}
