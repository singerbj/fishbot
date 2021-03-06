const Util = require("../util.js");
const path = require('path');
const fs = require('fs');
var LocalStorage = require('node-localstorage').LocalStorage;
const localstorage = new LocalStorage('./localStorage');

const lastPlayingTarkov = {};

module.exports = {
    trigger: Util.cmdTriggerSymbol + "tarkovq",
    description: "Get a DM when tarkov is booted after waiting in the queue. (Requires the activity status to be on in Discord settings.)",
    usage: Util.cmdTriggerSymbol + "tarkovq { on | off | specify nothing to check your subscription status }",
    func: async (message, cmdModules, cmdTriggers, client) => {
        const senderId = message.author.id;
        let guildToUse = message.guild;
        if(!guildToUse){
            client.guilds.cache.forEach((guild) => {
                if(!guildToUse && guild.members.cache.get(senderId)){
                    guildToUse = guild;
                }
            })
        }
        let newAlertsSetting = message.content.replace(Util.cmdTriggerSymbol + "tarkovq", "").trim();
        let currentAlertsSetting = localstorage.getItem(senderId);
        if(newAlertsSetting){
            if(newAlertsSetting === "on" || newAlertsSetting === "off"){
                if(guildToUse){
                    if (newAlertsSetting === "on") {
                        localstorage.setItem(senderId, "on");
                        return "You are now going to get notifications when Escape from Tarkov starts.";
                    } else {
                        localstorage.setItem(senderId, "off");
                        return "You are no longer going to get notifications when Escape from Tarkov starts.";
                    }
                } else {
                    return "You need to be in a server with Fishbot to use this command.";
                }
            } else {
                return "Invalid tarkovq setting specified. Please use either \"on\" or \"off\".";
            }
        } else {
            return "You are" + (currentAlertsSetting === "on" ? " " : " not ") + "currently receiving notifications when Escape from Tarkov starts.";
        }
    },
    runEvery10Seconds: async (client) => {
        console.log('lastPlayingTarkov', lastPlayingTarkov);
        let now = Date.now();
        client.guilds.cache.forEach((guild) => {
            guild.members.cache.forEach((member) => {
                const activity = member.presence.activities && member.presence.activities[0] && member.presence.activities[0].name;
                console.log('processing: ' + member.user.username + ' is playing: ' + activity || '<n/a>');
                if(activity && activity.toLowerCase().indexOf('tarkov') > -1){
                    if((!lastPlayingTarkov[member.user.username] || (now - lastPlayingTarkov[member.user.username]) > 300000) && localstorage.getItem(member.id) === 'on'){
                        console.log('messaging: ' + member.user.username);
                        client.users.fetch(member.id, false).then((user) => {
                            user.send('Escape from Tarkov has booted up @ ' + (new Date()));
                        });
                    } else {
                        console.log('not messaging: ' + member.user.username);
                    }
                    lastPlayingTarkov[member.user.username] = now;
                }
            });
        });
    },
    test: (self) => {
        //impossible to test?
    }
};
