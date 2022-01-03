const Util = require("../util.js");

const errorMessage = "Please specify a valid number of sides for the `!dice` command.";

module.exports = {
    trigger: Util.cmdTriggerSymbol + "dice",
    description: "This command rolls a dice with the given amount of sides and replies with the result.",
    usage: Util.cmdTriggerSymbol + "dice {# of sides}",
    func: (message) => {
        var sides = parseInt(message.content.replace(Util.cmdTriggerSymbol + "dice", "").trim(), 10);
        if (isNaN(sides) || sides < 0) {
            return errorMessage;
        } else {
            return Util.rand(1, sides + 1);
        }
    },
    test: (self) => {
        test('responds with a number on a 1 sided die', () => {
            expect(self.func({ content: "!dice 1" })).toBe(1);
        });

        test('responds with a number on a 2 sided die', () => {
            expect(self.func({ content: "!dice 2" })).toBeInArray([...Array(2).keys()].map((num) => num + 1));
        });

        test('responds with a number on a 6 sided die', () => {
            expect(self.func({ content: "!dice 6" })).toBeInArray([...Array(6).keys()].map((num) => num + 1));
        });

        test('responds with a number on a 100 sided die', () => {
            expect(self.func({ content: "!dice 100" })).toBeInArray([...Array(100).keys()].map((num) => num + 1));
        });

        test('responds with a number on a 100 sided die', () => {
            expect(self.func({ content: "!dice" })).toBe(errorMessage);
        });
    }
};
