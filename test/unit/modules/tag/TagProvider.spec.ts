import { DatabaseMock, mockResult } from "../../../__mocks__/Database";
import * as faker from "faker";
import { Tag } from "../../../../src/model/Tag";
import { TagProvider } from "../../../../src/modules/tag/TagProvider";

let mock_tags: Tag[];

beforeAll(() => {
  faker.seed(1337);

  mock_tags = [
    new Tag(faker.random.uuid(), faker.lorem.word(), faker.system.filePath()),
    new Tag(faker.random.uuid(), faker.lorem.word(), faker.system.filePath()),
    new Tag(faker.random.uuid(), faker.lorem.word(), faker.system.filePath()),
    new Tag(faker.random.uuid(), faker.lorem.word(), faker.system.filePath()),
    new Tag(faker.random.uuid(), faker.lorem.word(), faker.system.filePath()),
  ];
});

describe("Get Recipe Tags from Database", () => {
  let tagProvider: TagProvider;

  beforeEach(() => {
    const runMock = jest.fn().mockResolvedValue(
      mockResult(
        mock_tags.map((tag) => {
          return {
            tag: {
              properties: {
                name: tag.name,
                iconPath: tag.imagePath,
                tagId: tag.id,
              },
            },
          };
        })
      )
    );
    tagProvider = new TagProvider(new DatabaseMock({ runMock: runMock }));
  });

  it("should return a list of 5 Tags from Database", async () => {
    const result = tagProvider.getTags(5, 0);

    await expect(result).resolves.toMatchObject(mock_tags);
  });
});
