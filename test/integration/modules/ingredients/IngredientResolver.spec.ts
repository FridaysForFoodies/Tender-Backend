import testServer from "../../../__utils/testServer";

let query;

const queryString = "a";

const ingredientSuggestionsQuery = `query {
  ingredientSuggestions(query: "${queryString}") {
    name
  }
}`;

beforeAll(async () => {
  query = (await testServer()).query;
});

// TODO: Fix the test as soon as database schema is finalized (currently using mock data)

describe("QUERY ingredient suggestions", () => {
  it("should return ingredients containing the query", async () => {
    const result = await query({ query: ingredientSuggestionsQuery });
    result.data.ingredientSuggestions.forEach(i => expect(i.name).toContain(queryString))
  });
});
