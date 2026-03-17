import pool from "./db";
import { PoolClient, QueryResult } from "pg";

export class DatabaseConnection {
  async beginTransaction(): Promise<Transaction> {
    const client = await pool.connect();
    await client.query("BEGIN");
    return new Transaction(client);
  }
}

export class Transaction {
  constructor(private client: PoolClient) {}

  async query(text: string, params?: any[]): Promise<QueryResult> {
    return this.client.query(text, params);
  }

  async commit(): Promise<void> {
    await this.client.query("COMMIT");
    this.client.release();
  }

  async rollback(): Promise<void> {
    await this.client.query("ROLLBACK");
    this.client.release();
  }

  async release(): Promise<void> {
    this.client.release();
  }
}
