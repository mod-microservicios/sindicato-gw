import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { TransportModule } from 'src/transport/transport.module';

@Module({
  imports: [TransportModule],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
