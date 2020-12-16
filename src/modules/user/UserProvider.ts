import { Inject, Service } from "typedi";
import { DATABASE, IDatabase } from "../../Database";
import { User } from "../../model/User";

export const USER_PROVIDER = "user-provider";

export interface IUserProvider {
  getUserByUUID(uuid: string): Promise<User>;
  createUserWithUUID(uuid: string): Promise<User>;
}

@Service(USER_PROVIDER)
export class UserProvider implements IUserProvider {
  constructor(@Inject(DATABASE) private readonly db: IDatabase) {}

  async createUserWithUUID(uuid: string): Promise<User> {
    const session = this.db.getSession();
    try {
      const result = await session.run(
        "MERGE (user:User {uuid: $uuid }) RETURN user",
        {
          uuid: uuid,
        }
      );
      const [user] = await result.records.map((record) => {
        return new User(record.get("user").properties.uuid);
      });

      return user;
    } catch (e) {
      return Promise.reject(e);
    } finally {
      await session.close();
    }
  }

  async getUserByUUID(uuid: string): Promise<User> {
    const session = this.db.getSession();
    try {
      const result = await session.run(
        "MATCH (user:User) WHERE user.uuid = $uuid return user as user",
        {
          uuid: uuid,
        }
      );
      const [user] = await result.records.map((record) => {
        return new User(record.get("user").properties.uuid);
      });

      return user;
    } catch (e) {
      return Promise.reject(e);
    } finally {
      await session.close();
    }
  }
}
