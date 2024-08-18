const pg = require("pg");
require("dotenv").config();
const { Pool } = pg;
class Database {
  static instance;
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }

    this.pool = new Pool({
      // connectionString: process.env.POSTGRE_URL,
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });
    Database.instance = this;
  }

  async query(que, params) {
    const client = await this.pool.connect();
    try {
      return await client.query(que, params);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      client.release();
    }
  }
}
module.exports = Database;
