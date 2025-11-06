import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TransportModule } from 'src/transport/transport.module';

@Module({
  imports: [TransportModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
