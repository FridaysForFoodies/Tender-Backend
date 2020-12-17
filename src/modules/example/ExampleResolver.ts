import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Example } from "../../model/Example";

const exampleList: Example[] = [
  new Example(1, "Herr der Ringe", "Lorem ipsum dolor sit amet"),
  new Example(2, "Star Wars", "Metus aliquam eleifend "),
  new Example(3, "Pretty Woman", "Vel eros donec ac odio tempor orci dapibus."),
  new Example(
    4,
    "Mad Max",
    "Et netus et malesuada fames ac turpis egestas maecenas."
  ),
];

@Resolver()
export class ExampleResolver {
  @Query(() => Example, { nullable: false })
  async returnExample(@Arg("id") id: number): Promise<Example> {
    return exampleList.find((value) => value.id == id);
  }

  @Query(() => [Example])
  async returnAllExamples(): Promise<Example[]> {
    return exampleList;
  }

  @Mutation(() => Boolean)
  async createCategory(
    @Arg("name") name: string,
    @Arg("description") description: string
  ): Promise<boolean> {
    const lastItem = exampleList.reduce((previousValue, currentValue) =>
      previousValue.id < currentValue.id ? currentValue : previousValue
    );
    exampleList.push(new Example(lastItem.id + 1, name, description));
    return true;
  }
}
