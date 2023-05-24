import { Module } from '@nestjs/common';
import { PG_CONNECTION } from '../../../constants';
import { RdsClientService } from './services/rds-client-service';
import { pgPool } from '../../../db/pg/pgClient';

const dbProvider = {
  provide: PG_CONNECTION,
  useValue: new RdsClientService(pgPool)
}

@Module({
  providers: [ dbProvider ],
  exports: [ dbProvider ],
})
export class RdsDbModule {}
