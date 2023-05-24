import { Inject, Injectable } from '@nestjs/common';

import {
  CREATE_ORDER_QUERY, DELETE_ORDER_QUERY,
  GET_ORDER_BY_ID_WITH_ITEMS_QUERY, GET_ORDER_BY_USER_ID_WITH_ITEMS_QUERY,
  GET_ORDERS_WITH_ITEMS_QUERY, UPDATE_CART_STATUS_QUERY,
  UPDATE_ORDER_STATUS_QUERY
} from '../../db/pg/queries/cart-queries';
import { PG_CONNECTION } from '../../constants';
import { RdsClientService } from '../../shared/modules/rds-db/services/rds-client-service';

@Injectable()
export class OrderService {
  constructor(@Inject(PG_CONNECTION) private rds: RdsClientService) {
  }

  async getOrders() {
    try {
      const orders = await this.rds.runQuery(GET_ORDERS_WITH_ITEMS_QUERY);

      return orders.rows
    } catch (err) {
      throw err;
    }
  }

  async getOrder(orderId: string) {
    try {
      const order = await this.rds.runQuery(GET_ORDER_BY_ID_WITH_ITEMS_QUERY, [ orderId ]);
      return order.rows[0];
    } catch (err) {
      throw err;
    }
  }

  async getUserOrders(userId: string) {
    try {
      const orders = await this.rds.runQuery(GET_ORDER_BY_USER_ID_WITH_ITEMS_QUERY, [ userId ]);

      return orders.rows
    } catch (err) {
      throw err;
    }
  }

  async createOrder(data: any) {
    try {
      const { userId, cartId, payment, delivery, comments, status, total } = data;

      const [ createdOrderRes ] = await this.rds.runTransactQueries(async () => {
        const createdOrder = await this.rds.pgClient.query(CREATE_ORDER_QUERY, [ userId, cartId, payment, delivery, comments, status, total ]);
        await this.rds.pgClient.query(UPDATE_CART_STATUS_QUERY, [ 'ORDERED', cartId ]);
        return [ createdOrder ];
      });
      return createdOrderRes.rows[0];

    } catch (err) {
      throw err;
    }
  }

  async updateOrderStatus(orderId, data) {
    try {
      const order = this.getOrder(data.id);

      if (!order) {
        throw new Error('Order does not exist.');
      }

      const updated = await this.rds.runQuery(UPDATE_ORDER_STATUS_QUERY, [ data.status, orderId ]);
      return { updated }
    } catch (err) {
      throw err;
    }
  }

  async removeOrder(orderId: string) {
    try {
      await this.rds.runQuery(DELETE_ORDER_QUERY, [ orderId ]);
    } catch (err) {
      throw err;
    }
  }
}
