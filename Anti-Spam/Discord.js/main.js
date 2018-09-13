/**
 * Importing discord.js node.js module.
 * @type {Library}
 */
const Discord = require("discord.js");
/**
 * Creating a new Client object.
 * @type {Discord}
 */
const client = new Discord.Client();
/**
 * Importing json file that has the bot's configurations.
 * @type {JSON}
 */
const config = require("./config.json");
/**
 * [talkedRecently Storing msg authors data]
 * @type {Map}
 */
let talkedRecently = new Map();


client.on("ready", () => {
  /**
   * When the event "ready" is triggered, print the user tag.
   */
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (msg) => {
  /**
   * Checks if the msg is from a "guild" channel.
   * @return {}     return nothing, to skip the msg.
   */
  if(msg.channel.type != "text") return;
  let msgAuthorID = msg.author.id;
/**
 * Checking if the Map @ talkedRecently has the msg author id.
 */
  if (talkedRecently.has(msgAuthorID)) {
    let count = talkedRecently.get(msgAuthorID);
    if(count >= config.msgLimit) {
      /**
       * Adding mute role to the user that has exceeded the msg limit.
       */
      msg.member.addRole(msg.guild.roles.find("name", config.muteRoleName));
      /**
       * Deleteing the latest msg after muting the user.
       */
      msg.delete();
      /**
       * Setting timeout in order to remove the temp mute from the user.
       */
      setTimeout(function () {
        /**
         * Resetting the user's msg count.
         */
        talkedRecently.set(msgAuthorID, 0);
        /**
         * Removing the user's mute role.
         */
        msg.member.removeRole(msg.guild.roles.find("name", config.muteRoleName));
      }, config.msgLimitTimeout);
    } else {
      /**
       * Incrementing the user msg count.
       */
      talkedRecently.set(msgAuthorID, count + 1);
    }
  } else {
    /**
     * Adding a new user to the Map.
     */
    talkedRecently.set(msgAuthorID, 1);
  }
});
/**
 * Connecting to discord.
 */
client.login(config.token);
