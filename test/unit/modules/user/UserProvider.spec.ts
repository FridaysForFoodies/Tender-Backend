import { DatabaseMock, mockResult } from "../../../__mocks__/Database";
import { v4 as uuidv4 } from "uuid";
import * as faker from "faker";
import { UserProvider } from "../../../../src/modules/user/UserProvider";
import { User } from "../../../../src/model/User";

let mock_uuid;

beforeAll(() => {
  faker.seed(1337);

  mock_uuid = uuidv4();
});

describe("Get User from Database", () => {
  let user: User;
  let userProvider: UserProvider;

  beforeEach(() => {
    user = new User(mock_uuid);

    const runMock = jest.fn().mockResolvedValue(
      mockResult([
        {
          user: {
            properties: {
              uuid: user.uuid,
            },
          },
        },
      ])
    );
    userProvider = new UserProvider(new DatabaseMock({ runMock: runMock }));
  });

  it("should return User from Database based on its UUID", async () => {
    const result = await userProvider.getUserByUUID(mock_uuid);

    expect(result).toMatchObject(user);
  });

  it("should create User with UUID and return it from Database", async () => {
    const result = await userProvider.createUserWithUUID(mock_uuid);

    expect(result).toMatchObject(user);
  });
});
