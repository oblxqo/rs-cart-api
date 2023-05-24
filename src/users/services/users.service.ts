import { Inject, Injectable } from '@nestjs/common';

import { User } from '../models';
import { CREATE_USER_QUERY, GET_USER_BY_ID, GET_USER_LIST } from '../../db/pg/queries/cart-queries';
import { PG_CONNECTION } from '../../constants';
import { RdsClientService } from '../../shared/modules/rds-db/services/rds-client-service';

@Injectable()
export class UsersService {

  constructor(@Inject(PG_CONNECTION) private rds: RdsClientService) {
  }

  async findOne(userName: string): Promise<User> {
    try {
      const result = await this.rds.runQuery(GET_USER_BY_ID, [ userName ]);
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  }

  async createOne({ name, password }: User): Promise<User> {
    try {
      const result = await this.rds.runQuery(CREATE_USER_QUERY, [ name, password ]);
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  }

  async getUsers() {
    try {
      const result = await this.rds.runQuery(GET_USER_LIST);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }
}
