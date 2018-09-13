const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

let talkedRecently = new Map();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (msg) => {
  if(msg.channel.type != "text") return;
  let msgAuthorID = msg.author.id;

  if (talkedRecently.has(msgAuthorID)) {
    let count = talkedRecently.get(msgAuthorID);
    if(count >= config.msgLimit) {
      msg.member.addRole(msg.guild.roles.find("name", config.muteRoleName));
      msg.delete();
      setTimeout(function () {
        talkedRecently.set(msgAuthorID, 0);
        msg.member.removeRole(msg.guild.roles.find("name", config.muteRoleName));
      }, config.msgLimitTimeout);
    } else {
      talkedRecently.set(msgAuthorID, count + 1);
    }
  } else {
    talkedRecently.set(msgAuthorID, 1);
  }
});

client.login(config.token);
