import { Inject, Service } from "typedi";
import { DATABASE, IDatabase } from "../../Database";

export const USER_PROVIDER = "user-provider";

export interface IUserProvider {
  containsUser(uuid: string): Promise<boolean>;
}

@Service(USER_PROVIDER)
export class UserProvider implements IUserProvider {
  constructor(@Inject(DATABASE) private readonly db: IDatabase) {}

  async containsUser(uuid: string): Promise<boolean> {
    const session = this.db.getSession();
    try {
      const result = await session.run(
        "MATCH (user:User) WHERE user.uuid = $uuid return user as user",
        {
          username: uuid,
        }
      );
      return result.records.find((record, index) => record.has("uuid")) != null;
    } catch (e) {
      return Promise.reject(e);
    } finally {
      await session.close();
    }
  }
}
