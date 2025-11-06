import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UpdateLoginDto } from './dto/update-login.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LoginService implements OnModuleInit {
  constructor(@Inject('MS_AUTH') private client: ClientProxy) {}

  async onModuleInit() {
    await this.client.connect();
  }

  async create(authDto: AuthDto) {
    const result = await firstValueFrom(this.client.send('login' , authDto));
    console.log('LoginService create result:', result);
    return result;
  }

  findAll() {
    return `This action returns all login`;
  }

  findOne(id: number) {
    return `This action returns a #${id} login`;
  }

  update(id: number, updateLoginDto: UpdateLoginDto) {
    return `This action updates a #${id} login`;
  }

  remove(id: number) {
    return `This action removes a #${id} login`;
  }
}
