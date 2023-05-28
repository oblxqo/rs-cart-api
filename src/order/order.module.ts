import { Module } from '@nestjs/common';
import { OrderService } from './services';
import { RdsDbModule } from '../shared/modules/rds-db/rds-db.module';
import { OrderController } from './order.controller';

@Module({
  imports: [ RdsDbModule ],
  providers: [ OrderService ],
  exports: [ OrderService ],
  controllers: [ OrderController ]
})
export class OrderModule {}
