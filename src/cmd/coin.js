const Util = require("../util.js");

const sides = ["Heads", "Tails"];

module.exports = {
    trigger: Util.cmdTriggerSymbol + "coin",
    description: "This command flips a coin and responds with the result.",
    usage: Util.cmdTriggerSymbol + "coin",
    func: (message) => {
        return Util.rand(0, 2) === 1 ? sides[0] : sides[1];
    },
    test: (self) => {
        test('responds with the side of a coin', () => {
            expect(self.func()).toBeInArray(sides);
        });
    }
};
