const Util = require("../util.js");

module.exports = {
    trigger: Util.cmdTriggerSymbol + "help",
    description: "This command prints out all the things Fishbot can do and describes how to use them.",
    usage: Util.cmdTriggerSymbol + "help",
    func: (message, cmdModules, cmdTriggers, client) => {
        let filteredCmdTriggers = cmdTriggers;
        let commandArray = filteredCmdTriggers.map((cmdTrigger) => {
            return "`" + cmdModules[cmdTrigger].usage + "`\t\t" + cmdModules[cmdTrigger].description;
        });

        commandArray.unshift('Normal Commands:');

        message.author.send(commandArray.slice(0, Math.floor(commandArray.length / 2)));
        message.author.send(commandArray.slice(Math.floor(commandArray.length / 2), commandArray.length));
    },
    test: (self) => {
        //impossible to test?
    }
};
