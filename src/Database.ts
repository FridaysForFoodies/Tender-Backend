import { Driver, Session, driver, auth } from "neo4j-driver";
import { Service } from "typedi";

export const DATABASE = "database";

export interface IDatabase {
  getSession(): Session
  close(): Promise<void>
}

@Service(DATABASE)
export class Database implements IDatabase {
  private readonly driver: Driver;

  constructor() {
    this.driver = driver(
      process.env.DATABASE_URL,
      auth.basic(
        process.env.DATABASE_USERNAME,
        process.env.DATABASE_PASSWORD
      )
    );
  }

  getSession(): Session {
    return this.driver.session();
  }

  async close(): Promise<void> {
    await this.driver.close();
  }
}
