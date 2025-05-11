import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class UserGrpcController {
  @GrpcMethod('UserService', 'getUser')
  getUser(data: { id: string }) {
    console.log('📞 getUser called via gRPC with', data);
    return {
      id: data.id,
      name: 'Test User',
      email: 'test@example.com',
    };
  }
}
