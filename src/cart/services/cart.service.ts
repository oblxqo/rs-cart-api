import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { Cart, CartItem } from '../models';
import {
  CREATE_CART,
  CREATE_PRODUCT_IN_CART_QUERY, DELETE_CART_ITEM_BY_CART_AND_PRODUCT_QUERY,
  GET_CART_ITEM_BY_PRODUCT_ID_QUERY, GET_CART_ITEMS_LIST_QUERY_WITH_PRODUCT,
  GET_USER_CART_LIST_QUERY_BY_STATUS, UPDATE_CART_STATUS_QUERY,
  UPDATE_COUNT_CART_BY_ID_QUERY
} from '../../db/pg/queries/cart-queries';
import { CartStatus, PG_CONNECTION } from '../../constants';
import { RdsClientService } from '../../shared/modules/rds-db/services/rds-client-service';

@Injectable()
export class CartService {
  constructor(@Inject(PG_CONNECTION) private rds: RdsClientService) {}

  async findByUserId(userId: string): Promise<Cart> {
    try {
      if (!userId) {
        throw new HttpException('User ID is undefined', HttpStatus.UNAUTHORIZED);
      }

      const cart = await this.rds.runQuery(GET_USER_CART_LIST_QUERY_BY_STATUS, [userId, 'OPEN']);
      const cartId = cart.rows[0]?.id;

      if (!cartId) {
        return;
      }

      const items = await this.rds.runQuery(GET_CART_ITEMS_LIST_QUERY_WITH_PRODUCT, [cartId]);

      return {
        id: cartId,
        items: items.rows.map(cartItem => ({
          count: cartItem.count,
          product: {id: cartItem.id, title: cartItem.title, description: cartItem.description, price: cartItem.price}
        }))
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async createByUserId(userId: string): Promise<Cart> {
    try {
      const cart = await this.rds.runQuery(CREATE_CART, [userId, CartStatus.OPEN]);
      return {  id: cart.rows[0].id, items: [] } ;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return await this.createByUserId(userId);
  }

  async updateByUserId(userId: string, item: CartItem): Promise<any> {
    try {
      const productId = item.product.id;
      const cartRows = await this.rds.runQuery(GET_USER_CART_LIST_QUERY_BY_STATUS, [userId, 'OPEN']);
      const cart = cartRows?.rows[0];
      const cartId = cart?.id;
      let processedItem;

      const items = await this.rds.runQuery(GET_CART_ITEM_BY_PRODUCT_ID_QUERY,[cartId, productId]);
      const currentCart = items?.rows[0];

      if (item.count > 0 && currentCart) {
        const updated = await this.rds.runQuery(UPDATE_COUNT_CART_BY_ID_QUERY, [item.count, cartId, productId]);

        processedItem = updated?.rows[0];
        return { processedItem, cart };
      } else if (item.count <= 0 && currentCart) {
        const deleted = await this.rds.runQuery(DELETE_CART_ITEM_BY_CART_AND_PRODUCT_QUERY, [cartId, productId]);
        processedItem = deleted?.rows[0];
        return {cart, processedItem};
      }

      const created = await this.rds.runQuery(CREATE_PRODUCT_IN_CART_QUERY, [cartId, productId, item.count]);
      processedItem = created?.rows[0];
      return { processedItem, cart } ;

    } catch (err) {
      throw err;
    }
  }

  async setCartToOrdered(cartId: string) {
    try {
      const orderedCart = await this.rds.runQuery(UPDATE_CART_STATUS_QUERY, ['ORDERED', cartId]);

      console.log('In setCartToOrdered orderedCart: ', orderedCart);
    } catch (err) {
      throw err;
    }
  }
}
