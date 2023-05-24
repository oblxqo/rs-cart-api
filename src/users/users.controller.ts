import {
  Controller,
  Get,
  HttpStatus, Req,
} from '@nestjs/common';
import { UsersService } from './services';
import { AppRequest } from '../shared';

@Controller('api/users')
export class UsersController {
  constructor(private userService: UsersService) {
  }

  @Get()
  async getUsers(@Req() req: AppRequest) {
    const users = await this.userService.getUsers();

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      payload: { users },
    };
  }
}