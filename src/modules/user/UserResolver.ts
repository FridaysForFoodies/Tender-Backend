import { Query, Resolver } from "type-graphql";
import { User } from "../../model/User";
import { v4 as uuidv4 } from "uuid";
import { Inject } from "typedi";
import { IUserProvider, USER_PROVIDER } from "./UserProvider";

@Resolver(User)
export class UserResolver {
  constructor(
    @Inject(USER_PROVIDER) private readonly userProvider: IUserProvider
  ) {}

  @Query(() => User, { nullable: false })
  async generateUser(): Promise<User> {
    const newUuid = uuidv4();
    return new User(newUuid);
  }
}
