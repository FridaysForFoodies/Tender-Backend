
describe("GET / - a simple api endpoint", () => {
    it("Hello API Request", async () => {
        expect("hello").toEqual("hello");
        expect(200).toEqual(200);
    });
});