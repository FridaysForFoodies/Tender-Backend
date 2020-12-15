import testServer from "../../../__utils/testServer";
import { Container } from "typedi";
import { DATABASE, IDatabase } from "../../../../src/Database";

let query;

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

beforeAll(async () => {
  // Falls jemand hierfür noch ne bessere Lösung hat, feel free to edit
  jest.setTimeout(15000);
  console.log("Waiting for database...");
  await new Promise(r => setTimeout(r, 10000));
  console.log("Done waiting!");

  query = (await testServer()).query;
});

afterAll(async () => {
  await (Container.get(DATABASE) as IDatabase).close();
});

describe("QUERY ingredient suggestions", () => {
  it("should return ingredients containing the query", async () => {
    const result = await query({ query: ingredientSuggestionsQuery });

    result.data.ingredientSuggestions.forEach(i => expect(i.name).toContain(queryString));
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
      expect(ingredients[i].searchCount).toBeLessThanOrEqual(ingredients[i - 1].searchCount);
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
