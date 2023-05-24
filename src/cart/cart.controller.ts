import { Controller, Get, Put, Body, Req, Post, UseGuards, HttpStatus, HttpException } from '@nestjs/common';

import { OrderService } from '../order';
import { AppRequest, getUserIdFromRequest } from '../shared';

import { calculateCartTotal } from './models-rules';
import { CartService } from './services';
import { BasicAuthGuard } from '../auth';
import { toOrderDeliveryDB } from '../shared/converters/order.converter';

@Controller('api/profile/cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService
  ) {
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Get()
  async findUserCart(@Req() req: AppRequest) {
    try {
      const cart = await this.cartService.findOrCreateByUserId(getUserIdFromRequest(req));

      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        payload: cart,
      }
    } catch (err) {
      if (err.status) {
        throw new HttpException(err.response, err.status);
      }
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Put()
  async updateUserCart(@Req() req: AppRequest, @Body() body) {
    try {
      const {processedItem, cart} = await this.cartService.updateByUserId(getUserIdFromRequest(req), body)

      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        payload: {
          cart,
          processedItem,
        }
      }
    } catch (err) {
      if (err.status) {
        throw new HttpException(err.response, err.status);
      }
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Post('checkout')
  async checkout(@Req() req: AppRequest, @Body() body) {
    const userId = getUserIdFromRequest(req);
    const cart = await this.cartService.findByUserId(userId);

    if (!(cart && cart.items.length)) {
      const statusCode = HttpStatus.BAD_REQUEST;
      req.statusCode = statusCode

      return {
        statusCode,
        message: 'Cart is empty',
      }
    }

    const {id: cartId, items} = cart;
    const total = calculateCartTotal(cart);
    const order = await this.orderService.createOrder({
      // ...body,
      ...toOrderDeliveryDB(body),
      userId,
      cartId,
      total,
      status: 'OPEN',
      payment: {type: 'Western Union'}
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      payload: order
    }
  }
}
