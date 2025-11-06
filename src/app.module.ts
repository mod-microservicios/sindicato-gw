import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TransportModule } from './transport/transport.module';
import { LoginModule } from './apps/login/login.module';
import { UserModule } from './apps/auth-ms/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // hace que las variables estén disponibles en toda la app
    }),
    TransportModule,
    LoginModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
