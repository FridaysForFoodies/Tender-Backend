import { Query, Resolver } from "type-graphql";
import { User } from "../../model/User";
import { v4 as uuidv4 } from "uuid";
import { Inject } from "typedi";
import { IUserProvider, USER_PROVIDER } from "./UserProvider";
import {
  IRecipePreferencesProvider,
  RECIPE_PREFERENCES_PROVIDER,
} from "../recipe_preferences/RecipePreferencesProvider";
import { RecipePreferences } from "../../model/RecipePreferences";

@Resolver(User)
export class UserResolver {
  constructor(
    @Inject(USER_PROVIDER) private readonly userProvider: IUserProvider,
    @Inject(RECIPE_PREFERENCES_PROVIDER)
    private readonly recipePreferencesProvider: IRecipePreferencesProvider
  ) {}

  @Query(() => User, { nullable: false })
  async generateUser(): Promise<User> {
    const user = await this.userProvider.createUserWithUUID(uuidv4());
    const defaultPreferences = new RecipePreferences(
      user,
      false,
      false,
      false,
      false,
      15
    );
    await this.recipePreferencesProvider.setRecipePreferences(
      defaultPreferences,
      user
    );
    return user;
  }
}
