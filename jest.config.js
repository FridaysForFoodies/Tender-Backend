module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["./node_modules/", "./test/__utils", "./build/"],
  moduleFileExtensions: ["ts", "tsx", "js"],
  setupFiles: ["./jest.setup-file.ts"],
};
