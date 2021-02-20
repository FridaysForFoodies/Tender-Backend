export default class InputValidater {
  private static readonly helloFreshIdRegex = /^[0-9,a-f]{24}$/;

  private static readonly userIdRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

  private static readonly userInputRegex = /^[0-9A-Za-zäöüÄÖÜß*,\- ]{1,100}$/;

  static validateHelloFreshId(input: string) {
    return InputValidater.helloFreshIdRegex.test(input);
  }

  static validateHelloFreshIds(input: [string]) {
    return !input.some((id) => !InputValidater.validateHelloFreshId(id));
  }

  static validateUserId(input: string) {
    return InputValidater.userIdRegex.test(input);
  }

  static validateUserInput(input: string) {
    return InputValidater.userInputRegex.test(input);
  }
}
