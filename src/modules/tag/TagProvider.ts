import { Inject, Service } from "typedi";
import { DATABASE, IDatabase } from "../../Database";
import { Tag } from "../../model/Tag";
import { Record } from "neo4j-driver";

export const TAG_PROVIDER = "tag-provider";

export interface ITagProvider {
  getTags(take: number, skip: number): Promise<Tag[]>;
}

@Service(TAG_PROVIDER)
export class TagProvider implements ITagProvider {
  constructor(@Inject(DATABASE) private readonly db: IDatabase) {}

  private static recordToTag(record: Record): Tag {
    const properties = record.get("tag").properties;
    return new Tag(properties.tagId, properties.name, properties.iconPath);
  }

  async getTags(take: number, skip: number): Promise<Tag[]> {
    const session = this.db.getSession();
    try {
      const result = await session.run(
        `MATCH (tag:Tag) \n
                RETURN tag SKIP toInteger($skip) LIMIT toInteger($limit)`,
        {
          limit: take,
          skip: skip,
        }
      );

      return result.records.map((r) => TagProvider.recordToTag(r));
    } catch (e) {
      return Promise.reject(e);
    } finally {
      await session.close();
    }
  }
}
