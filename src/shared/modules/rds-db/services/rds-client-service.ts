import { Pool } from 'pg';
import { Injectable } from '@nestjs/common';


@Injectable()
export class RdsClientService {
  public pgClient: Pool;

  constructor(pgClient: Pool) {
    this.pgClient = pgClient;
  }

  public async runTransactQueries(cb: () => Promise<any>): Promise<any> {
    const poolClient = await this.pgClient.connect();
    let result;

    try {
      await poolClient.query('BEGIN');
      try {
        result = await cb();
        await poolClient.query('COMMIT');
      } catch (err) {
        await poolClient.query('ROLLBACK');
        throw err;
      }
    } finally {
      await poolClient.release();
    }
    return result;
  }

  public async runQuery(query, params?): Promise<any> {
    const poolClient = await this.pgClient.connect();
    let result;

    try {
      try {
        result = await poolClient.query(query, params);
      } catch (err) {
        throw err;
      }
    } finally {
      await poolClient.release();
    }
    return result;
  }
}