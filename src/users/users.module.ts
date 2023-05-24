import { Module } from '@nestjs/common';

import { UsersService } from './services';
import { RdsDbModule } from '../shared/modules/rds-db/rds-db.module';
import { UsersController } from './users.controller';

@Module({
  imports: [ RdsDbModule ],
  providers: [ UsersService ],
  exports: [ UsersService ],
  controllers: [ UsersController ]
})
export class UsersModule {}
