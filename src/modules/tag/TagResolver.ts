import { Args, Query, Resolver } from "type-graphql";
import { Inject } from "typedi";
import { ITagProvider, TAG_PROVIDER } from "./TagProvider";
import { Tag } from "../../model/Tag";
import { FindTagsArgs } from "./FindTagsArgs";

@Resolver(TagResolver)
export class TagResolver {
  constructor(
    @Inject(TAG_PROVIDER) private readonly tagProvider: ITagProvider
  ) {}

  @Query(() => [Tag])
  async findTags(@Args() { take, skip }: FindTagsArgs): Promise<Tag[]> {
    return await this.tagProvider.getTags(take, skip);
  }
}
