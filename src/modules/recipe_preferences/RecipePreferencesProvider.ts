import { Inject, Service } from "typedi";
import { DATABASE, IDatabase } from "../../Database";
import { User } from "../../model/User";
import { RecipePreferences } from "../../model/RecipePreferences";
import { Record } from "neo4j-driver";
import InputValidater from "../input_validation/InputValidater";

export const RECIPE_PREFERENCES_PROVIDER = "recipe-preferences-provider";
const VEGAN_TAG_ID = "5e88692dc44d94aaee373161";
const VEGETARIAN_TAG_ID = "5e88692fc44d94aaee3733dd";
const GLUTENFREE_TAG_ID = "5e88699cf83168ab027a9889";
const LACTOSEFREE_TAG_ID = "5e886a3efcc163ab0e45f6cc";

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
    // Validate
    if (!InputValidater.validateUserId(user.uuid))
      throw new Error("Invalid userId");

    const session = this.db.getSession();
    try {
      const result = await session.run(
        `MATCH (user:User { uuid: $userId }) 
MATCH (user)<-[:HAS_PREF]-(prefs) 
WITH prefs, user

CALL {
  WITH user
  MATCH (user)<-[pref:IS_PREF]-(tag:Tag { tagId: $veganTagId })
  RETURN pref.active as vegan
}

CALL {
  WITH user
  MATCH (user)<-[pref:IS_PREF]-(tag:Tag { tagId: $vegetarianTagId })
  RETURN pref.active as vegetarian
}

CALL {
  WITH user
  MATCH (user)<-[pref:IS_PREF]-(tag:Tag { tagId: $glutenfreeTagId })
  RETURN pref.active as glutenfree
}

CALL {
  WITH user
  MATCH (user)<-[pref:IS_PREF]-(tag:Tag { tagId: $lactosefreeTagId })
  RETURN pref.active as lactosefree
}

RETURN prefs.cookingTime as cookingTime, vegan, vegetarian, glutenfree, lactosefree`,
        {
          userId: user.uuid,
          veganTagId: VEGAN_TAG_ID,
          vegetarianTagId: VEGETARIAN_TAG_ID,
          glutenfreeTagId: GLUTENFREE_TAG_ID,
          lactosefreeTagId: LACTOSEFREE_TAG_ID,
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
    // Validate
    if (!InputValidater.validateUserId(user.uuid))
      throw new Error("Invalid userId");

    const session = this.db.getSession();
    try {
      const result = await session.run(
        `MATCH (user:User { uuid: $userId }) \n

MERGE (user)<-[r:HAS_PREF]-(prefs:RecipePrefs) 
ON MATCH SET prefs.cookingTime = $cookingTime
ON CREATE SET prefs.cookingTime = $cookingTime
WITH prefs, user

CALL {
  WITH user
  MATCH (tag:Tag { tagId: $veganTagId })
  MERGE (user)<-[pref:IS_PREF]-(tag) 
  ON MATCH SET pref.active = $vegan
  ON CREATE SET pref.active = $vegan
  RETURN pref.active as vegan
}

CALL {
  WITH user
  MATCH (tag:Tag { tagId: $vegetarianTagId })
  MERGE (user)<-[pref:IS_PREF]-(tag) 
  ON MATCH SET pref.active = $vegetarian
  ON CREATE SET pref.active = $vegetarian
  RETURN pref.active as vegetarian
}

CALL {
  WITH user
  MATCH (tag:Tag { tagId: $glutenfreeTagId })
  MERGE (user)<-[pref:IS_PREF]-(tag) 
  ON MATCH SET pref.active = $glutenfree
  ON CREATE SET pref.active = $glutenfree
  RETURN pref.active as glutenfree
}

CALL {
  WITH user
  MATCH (tag:Tag { tagId: $lactosefreeTagId })
  MERGE (user)<-[pref:IS_PREF]-(tag) 
  ON MATCH SET pref.active = $lactosefree
  ON CREATE SET pref.active = $lactosefree
  RETURN pref.active as lactosefree
}

RETURN prefs.cookingTime as cookingTime, vegan, vegetarian, glutenfree, lactosefree`,
        {
          userId: user.uuid,
          veganTagId: VEGAN_TAG_ID,
          vegetarianTagId: VEGETARIAN_TAG_ID,
          glutenfreeTagId: GLUTENFREE_TAG_ID,
          lactosefreeTagId: LACTOSEFREE_TAG_ID,
          vegan: pref.vegan,
          vegetarian: pref.vegetarian,
          glutenfree: pref.glutenfree,
          lactosefree: pref.lactosefree,
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
      return new RecipePreferences(
        user,
        record.get("vegan"),
        record.get("vegetarian"),
        record.get("glutenfree"),
        record.get("lactosefree"),
        record.get("cookingTime")
      );
    });

    return prefs;
  }
}
