import { Inject, Service } from "typedi";
import { DATABASE, IDatabase } from "../../Database";
import { User } from "../../model/User";
import { RecipePreferences } from "../../model/RecipePreferences";
import { Record } from "neo4j-driver";

export const RECIPE_PREFERENCES_PROVIDER = "recipe-preferences-provider";

export interface IRecipePreferencesProvider {
  getRecipePreferences(user: User): Promise<RecipePreferences>;
  setRecipePreferences(
    pref: RecipePreferences,
    user: User
  ): Promise<RecipePreferences>;
}

@Service(RECIPE_PREFERENCES_PROVIDER)
export class RecipePreferencesProvider implements IRecipePreferencesProvider {
  constructor(@Inject(DATABASE) private readonly db: IDatabase) {}

  async getRecipePreferences(user: User): Promise<RecipePreferences> {
    const session = this.db.getSession();
    try {
      const result = await session.run(
        "MATCH (user:User { uuid: $userId }) \n" +
          "MATCH (user)-[:HAS_PREF]->(prefs) RETURN prefs",
        {
          userId: user.uuid,
        }
      );
      return this._createRecipePrefsFromRecord(result.records, user);
    } catch (e) {
      return Promise.reject(e);
    } finally {
      await session.close();
    }
  }

  async setRecipePreferences(
    pref: RecipePreferences,
    user: User
  ): Promise<RecipePreferences> {
    const session = this.db.getSession();
    try {
      const result = await session.run(
        "MATCH (user:User { uuid: $userId }) \n" +
          "OPTIONAL MATCH (user)-[r:HAS_PREF]->() \n" +
          "MERGE (prefs:RecipePrefs {dairy: $dairy, gluten: $gluten, vegetarian: $vegetarian, vegan: $vegan, cookingTime: $cookingTime}) \n" +
          "CREATE (user)-[:HAS_PREF]->(prefs) \n" +
          "DELETE r \n" +
          "RETURN prefs",
        {
          userId: user.uuid,
          vegan: pref.vegan,
          vegetarian: pref.vegetarian,
          gluten: pref.glutenfree,
          dairy: pref.dairyfree,
          cookingTime: pref.cookingTime,
        }
      );

      return this._createRecipePrefsFromRecord(result.records, user);
    } catch (e) {
      return Promise.reject(e);
    } finally {
      await session.close();
    }
  }

  private _createRecipePrefsFromRecord(
    records: Record[],
    user: User
  ): RecipePreferences {
    const [prefs] = records.map((record) => {
      const properties = record.get("prefs").properties;
      return new RecipePreferences(
        user,
        properties.vegan,
        properties.vegetarian,
        properties.gluten,
        properties.dairy,
        properties.cookingTime
      );
    });

    return prefs;
  }
}
