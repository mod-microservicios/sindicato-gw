import { PartialType } from '@nestjs/swagger';
import { AuthDto } from './auth.dto';

export class UpdateLoginDto extends PartialType(AuthDto) {}
