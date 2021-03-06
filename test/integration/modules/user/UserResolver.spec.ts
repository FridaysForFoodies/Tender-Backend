import testServer from "../../../__utils/testServer";
import { Container } from "typedi";
import { DATABASE, IDatabase } from "../../../../src/Database";
import * as uuid from "uuid";

let query;

const generateUserQuery = `query {
  generateUser {
    uuid
  }
}`;

beforeAll(async () => {
  query = (await testServer()).query;
});

afterAll(async () => {
  await (Container.get(DATABASE) as IDatabase).close();
});

describe("QUERY generate User", () => {
  it("should return a valid UUID user ID", async () => {
    const result = await query({ query: generateUserQuery });

    expect(uuid.validate(result.data.generateUser.uuid)).toBeTruthy();
  });
});
