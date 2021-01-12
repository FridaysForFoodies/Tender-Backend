import testServer, { loadConfig } from "../../../__utils/testServer";
import { Container } from "typedi";
import { DATABASE, IDatabase } from "../../../../src/Database";
import { USER_PROVIDER, UserProvider } from "../../../../src/modules/user/UserProvider";
import { User } from "../../../../src/model/User";

const TEST_UUID = "0022e730-10f8-460b-95e6-037d65940eaf";

let query;
let mock_user: User;

const queryString = "a";
const count = 3;

const ingredientSuggestionsQuery = `query {
  ingredientSuggestions(query: "${queryString}") {
    name
  }
}`;
const ingredientSuggestionsCountQuery = `query {
  ingredientSuggestions(query: "${queryString}", count: ${count}) {
    name
  }
}`;
const popularIngredientsQuery = `query {
  popularIngredients {
    searchCount
  }
}`;
const popularIngredientsCountQuery = `query {
  popularIngredients(count: ${count}) {
    searchCount
  }
}`;
const personalCommonIngredientsQuery = `query {
  personalCommonIngredients {
    searchCount
  }
}`;
const personalCommonIngredientsCountQuery = `query {
  personalCommonIngredients(count: ${count}) {
    searchCount
  }
}`;

beforeAll(async () => {
  query = (await testServer()).query;
});

afterAll(async () => {
  await (Container.get(DATABASE) as IDatabase).close();
});

describe("QUERY ingredient suggestions", () => {
  it("should return ingredients containing the query", async () => {
    const result = await query({ query: ingredientSuggestionsQuery });

    result.data.ingredientSuggestions.forEach((i) =>
      expect(i.name).toContain(queryString)
    );
  });

  it("should return no more than five ingredients", async () => {
    const result = await query({ query: ingredientSuggestionsQuery });

    expect(result.data.ingredientSuggestions.length).toBeLessThanOrEqual(5);
  });

  it("should return no more than the requested number of ingredients", async () => {
    const result = await query({ query: ingredientSuggestionsCountQuery });

    expect(result.data.ingredientSuggestions.length).toBeLessThanOrEqual(count);
  });
});

describe("QUERY popular ingredients", () => {
  it("should return ingredients sorted by search count in descending order", async () => {
    const result = await query({ query: popularIngredientsQuery });

    const ingredients = result.data.popularIngredients;
    for (let i = 1; i < ingredients.length; i++) {
      expect(ingredients[i].searchCount).toBeLessThanOrEqual(
        ingredients[i - 1].searchCount
      );
    }
  });

  it("should return no more than five ingredients", async () => {
    const result = await query({ query: popularIngredientsQuery });

    expect(result.data.popularIngredients.length).toBeLessThanOrEqual(5);
  });

  it("should return no more than the requested number of ingredients", async () => {
    const result = await query({ query: popularIngredientsCountQuery });

    expect(result.data.popularIngredients.length).toBeLessThanOrEqual(count);
  });
});


describe("QUERY personal common ingredients", () => {
  beforeAll(async () => {
    loadConfig();

    const userProvider = Container.get(USER_PROVIDER) as UserProvider;
    mock_user = await userProvider.createUserWithUUID(TEST_UUID);

    const server = await testServer({
      context() {
        return {
          user: mock_user
        };
      }
    });
    query = server.query;
  });

  it("should return ingredients sorted by search count in descending order", async () => {
    const result = await query({ query: personalCommonIngredientsQuery });

    const ingredients = result.data.personalCommonIngredients;
    for (let i = 1; i < ingredients.length; i++) {
      expect(ingredients[i].searchCount).toBeLessThanOrEqual(
        ingredients[i - 1].searchCount
      );
    }
  });

  it("should return no more than five ingredients", async () => {
    const result = await query({ query: personalCommonIngredientsQuery });

    expect(result.data.personalCommonIngredients.length).toBeLessThanOrEqual(5);
  });

  it("should return no more than the requested number of ingredients", async () => {
    const result = await query({ query: personalCommonIngredientsCountQuery });

    expect(result.data.personalCommonIngredients.length).toBeLessThanOrEqual(count);
  });
});
