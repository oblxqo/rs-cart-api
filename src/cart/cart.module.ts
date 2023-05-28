import { Module } from '@nestjs/common';

import { OrderModule } from '../order/order.module';

import { CartController } from './cart.controller';
import { CartService } from './services';
import { RdsDbModule } from '../shared/modules/rds-db/rds-db.module';


@Module({
  imports: [ RdsDbModule, OrderModule ],
  providers: [ CartService ],
  controllers: [ CartController ]
})
export class CartModule {}
