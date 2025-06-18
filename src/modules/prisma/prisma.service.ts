import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import bcrypt from 'bcryptjs';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();
    this.$use(async (param, next) => {
      const result = await next(param);
      if (
        ['create', 'createManyAndReturn', 'createMany'].includes(param.action)
      ) {
        const modelName = param.model.toLowerCase();
        const valueToHash = result.id;

        const salt = bcrypt.genSaltSync(5);
        const hash = await bcrypt.hash(valueToHash.toString(), salt);

        await this[modelName].update({
          where: { id: result.id },
          data: { hash },
        });

        return this[modelName].findUnique({
          where: { id: result.id },
        });
      }
      return result;
    });
  }

  onModuleInit() {
    this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
