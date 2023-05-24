import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Put,
  Query,
  Req, UseGuards
} from '@nestjs/common';
import { OrderService } from './services';
import { AppRequest } from '../shared';
import { UserQueryDto } from '../shared/dto/user-query.dto';
import { BasicAuthGuard } from '../auth';
import { toOrdersBody } from '../shared/converters/order.converter';

@Controller('api/orders')
export class OrderController {
  constructor(private orderService: OrderService) {
  }

  // @UseGuards(BasicAuthGuard)
  @Get()
  async getOrders(@Req() req: AppRequest) {
    try {
      const orders = await this.orderService.getOrders();

      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        payload: toOrdersBody(orders),
      }
    } catch (err) {
      if (err.status) {
        throw new HttpException(err.response, err.status);
      }
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(BasicAuthGuard)
  @Get()
  async getUserOrders(@Query() query: UserQueryDto) {
    try {
      const orders = await this.orderService.getUserOrders(query.user.id);

      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        payload: toOrdersBody(orders)
      };
    } catch (err) {
      if (err.status) {
        throw new HttpException(err.response, err.status);
      }
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async getOrderById(@Req() req: AppRequest) {
    try {
      const order = await this.orderService.getOrder(req.params.id);

      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        payload: toOrdersBody([ order ])[0],
      };
    } catch (err) {
      if (err.status) {
        throw new HttpException(err.response, err.status);
      }
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id/status')
  async updateOrder(@Req() req, @Body() body) {
    try {
      await this.orderService.updateOrderStatus(req.params.id, body)
      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
      };
    } catch (err) {
      if (err.status) {
        throw new HttpException(err.response, err.status);
      }
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  async deleteOrder(@Param('id') orderId: string) {
    try {
      await this.orderService.removeOrder(orderId);
      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
      };
    } catch (err) {
      if (err.status) {
        throw new HttpException(err.response, err.status);
      }
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }
}