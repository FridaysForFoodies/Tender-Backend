import { Context } from "vm";
import { createParamDecorator } from "type-graphql";

export default function CurrentUser() {
  return createParamDecorator<Context>(({ context }) => context.user);
}
