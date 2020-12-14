import { Inject, Service } from "typedi";
const { AuthenticationError } = require("apollo-server-errors");
import { DATABASE, IDatabase } from "../../Database";
import { User } from "../../model/User";

export const USER_PROVIDER = "user-provider";

export interface IUserProvider {
  getUserByUUID(uuid: string): Promise<User>;
}

@Service(USER_PROVIDER)
export class UserProvider implements IUserProvider {
  constructor(@Inject(DATABASE) private readonly db: IDatabase) {}

  async getUserByUUID(uuid: string): Promise<User> {
    const session = this.db.getSession();
    try {
      const result = await session.run(
        "MATCH (user:User) WHERE user.uuid = $uuid return user as user",
        {
          username: uuid,
        }
      );
      const [user] = await result.records.map((record) => {
        return record.get("user") as User;
      });

      return user;
    } catch (e) {
      return Promise.reject(e);
    } finally {
      await session.close();
    }
  }
}
