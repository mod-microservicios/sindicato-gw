import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

const userPattern = {
  create: 'createUser',
  findAll: 'findAllUsers',
  findOne: 'findOneUser',
  update: 'updateUser',
  remove: 'removeUser',
};

@Injectable()
export class UserService {
  constructor(@Inject('MS_AUTH') private client: ClientProxy) {}
  async create(createUserDto: CreateUserDto) {
    return await firstValueFrom(this.client.send(userPattern.create, createUserDto));
  }

  async findAll() {
    return await firstValueFrom(this.client.send(userPattern.findAll, {}));
  }

  async findOne(id: string) {
    return await firstValueFrom(this.client.send(userPattern.findOne,  id ));
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await firstValueFrom(this.client.send(userPattern.update, { id, ...updateUserDto }));
  }

  async remove(id: string) {
    return await firstValueFrom(this.client.send(userPattern.remove,  id ));
  }
}
