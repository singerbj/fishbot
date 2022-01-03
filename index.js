require('array-flat-polyfill');
const path = require('path');
const fs = require('fs');
const Discord = require("discord.js");
const client = new Discord.Client();
const q = require("q");
const Filter = require('bad-words');
const filter = new Filter();

const Util = require("./src/util.js");

const CMD_MODULES_PATH = './src/cmd';
const AUDIO_ASSETS_PATH = './assets';

const getCmdModules = () => {
    let deferred = q.defer();
    let cmdModules = {};
    fs.readdir(CMD_MODULES_PATH, function (err, files) {
        if (err) {
            console.log('Unable to scan directory: ' + err);
            process.exit(1);
        }
        let module;
        let cmdTriggers = [];
        files.forEach(function (file) {
            module = require(CMD_MODULES_PATH + '/' + file);
            cmdModules[module.trigger] = module;
            cmdTriggers.push(module.trigger);
        });

        deferred.resolve({ cmdModules, cmdTriggers });
    });
    return deferred.promise;
};

const getAudioAssets = () => {
    let deferred = q.defer();
    let audioAssets = {};
    fs.readdir(AUDIO_ASSETS_PATH, function (err, files) {
        if (err) {
            console.log('Unable to scan directory: ' + err);
            process.exit(1);
        }
        let audioTriggers = [];
        let trigger;
        files.forEach(function (file) {
            if(file.indexOf('opus') > -1){
                trigger = file.split('.')[0];
                audioAssets[Util.cmdTriggerSymbol + trigger] = file;
                audioTriggers.push(Util.cmdTriggerSymbol + trigger);
            }
        });

        deferred.resolve({ audioAssets, audioTriggers });
    });
    return deferred.promise;
};

getCmdModules().done(({ cmdModules, cmdTriggers }) => {
    getAudioAssets().done(({ audioAssets, audioTriggers }) => {
        const allTriggers = cmdTriggers.concat(audioTriggers);
        process.on('unhandledRejection', function(error) {
            console.log("####################################################################################################");
            console.log(error);
            console.log(error.stack);

            client.guilds.cache.forEach((guild) => {
                let errorChannel;
                guild.channels.cache.forEach((channel) => {
                    if(channel.name.toLowerCase() === "fishbot-development"){
                        errorChannel = channel;
                    }
                });
                if(errorChannel){
                    errorChannel.send(error.message);
                    errorChannel.send(error.stack);
                }
            });
            console.log("####################################################################################################");
        });

        client.on("ready", () => {
            console.log("Fishbot Connected to discord!");
        });

        client.on("message", (message) => {
            if(message.author.id !== client.user.id){
                let isProfane = false;
                if(message && message.channel && message.channel.name === "public"){
                    isProfane = filter.isProfane(message.content);
                    if(isProfane){
                        message.reply("Your manners upset me! Take a moment to think about what you've done.");
                        message.delete();
                    }
                }

                if(isProfane === false){
                    if(message && message.content && message.content[0] === Util.cmdTriggerSymbol){
                        allTriggers.forEach(async (trigger) => {
                            if(message && message.content.trim().split(" ")[0] && message.content.trim().split(" ")[0] === trigger){
                                console.log("====================================================================================================");
                                console.log("Command found: " + trigger);
                                console.log("Message: " + message);

                                let reply;
                                if(cmdModules[trigger]){
                                    console.log("Command handler running...");
                                    reply = await cmdModules[trigger].func(message, cmdModules, cmdTriggers, client, audioAssets, audioTriggers);
                                }

                                if(reply){
                                    console.log("Reply: " + reply);
                                    if(typeof reply === "array"){
                                        reply.forEach((replyPart) => {
                                            message.reply(replyPart);
                                        });
                                    } else {
                                        console.log(reply);
                                        message.reply(reply);
                                    }
                                } else {
                                    console.log("Reply: (None)");
                                }
                                console.log("====================================================================================================");
                            }
                        });
                    }
                }
            }
        });
        // handle scheduled tasks that run every 250ms
        setInterval(() => {
            cmdTriggers.forEach(async (cmdTrigger) => {
                if(cmdModules[cmdTrigger].runEveryHalfSecond){
                    cmdModules[cmdTrigger].runEveryHalfSecond(client);
                }
            });
        }, 500);

        // handle scheduled tasks that run every 10 seconds
        setInterval(() => {
            cmdTriggers.forEach(async (cmdTrigger) => {
                if(cmdModules[cmdTrigger].runEvery10Seconds){
                    cmdModules[cmdTrigger].runEvery10Seconds(client);
                }
            });
        }, 10000);

        // handle scheduled tasks that run every 60 seconds
        setInterval(() => {
            cmdTriggers.forEach(async (cmdTrigger) => {
                if(cmdModules[cmdTrigger].runEvery60Seconds){
                    cmdModules[cmdTrigger].runEvery60Seconds(client);
                }
            });
        }, 60000);

        client.login(process.env["discord_key"]);
    });
});
