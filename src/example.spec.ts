import testServer from './testUtils/testServer'

let query;

const exampleQuery = `query {
  returnExample(id: 1) {
    name
    description
  }
}`;

beforeAll(async () => {
    query = (await testServer()).query;
});

describe("QUERY / - a simple api endpoint", () => {
    it("Example API Request", async () => {
        const result = await query({query: exampleQuery});

        expect(result.data).toMatchObject({
            returnExample: {
                name: "Herr der Ringe",
                description: "Lorem ipsum dolor sit amet",
            },
        });
    });
});