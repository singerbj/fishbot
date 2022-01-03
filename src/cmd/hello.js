const Util = require("../util.js");

const respOptions = ["Hello!", "Bonjour!", "Wuz up!", "Hola!", "Sup!"];

module.exports = {
    trigger: Util.cmdTriggerSymbol + "hello",
    description: "This command responds with a random greeting when you say Hello to Fishbot!",
    usage: Util.cmdTriggerSymbol + "hello",
    func: (message) => {
        return respOptions[Util.rand(0, respOptions.length)];
    },
    test: (self) => {
        test('responds with a random greeting', async () => {
            expect(self.func()).toBeInArray(respOptions);
        });
    }
};
