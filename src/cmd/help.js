const Util = require("../util.js");

module.exports = {
    trigger: Util.cmdTriggerSymbol + "help",
    description: "This command prints out all the things Fishbot can do and describes how to use them.",
    usage: Util.cmdTriggerSymbol + "help",
    func: (message, cmdModules, cmdTriggers, client, audioAssets, audioTriggers) => {
        let filteredCmdTriggers = cmdTriggers;
        if(message.author.id !== Util.gooseUserId){
            filteredCmdTriggers = cmdTriggers.filter((cmdTrigger) => {
                return cmdModules[cmdTrigger].trigger && cmdModules[cmdTrigger].hidden !== true;
            });
        }
        let commandArray = filteredCmdTriggers.map((cmdTrigger) => {
            return "`" + cmdModules[cmdTrigger].usage + "`\t\t" + cmdModules[cmdTrigger].description;
        });
        let audioAssetArray = audioTriggers.map((audioTrigger) => {
            return "`" + audioTrigger + "`\t\tPlay the " + audioTrigger + " audio file.";
        });

        commandArray.unshift('Normal Commands:');
        audioAssetArray.unshift('Music Commands:');

        message.author.send(commandArray.slice(0, Math.floor(commandArray.length / 2)));
        message.author.send(commandArray.slice(Math.floor(commandArray.length / 2), commandArray.length));
        message.author.send(audioAssetArray);
    },
    test: (self) => {
        //impossible to test?
    }
};
