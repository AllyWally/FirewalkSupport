const { MessageEmbed, Message, ReactionEmoji } = require('discord.js');
const mongoose = require('mongoose');
const User = require('../models/user');
const Guild = require('../models/guild')
const pagination = require('discord.js-pagination')
const moment = require('moment')
const { inspect } = require("util") 
module.exports = { 
    name: "userinfo",
    aliases: ["query", "userinfo"],
    run: async (client, message, args) => {
        message.delete();
        if(!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(`Permission was denied missing \`ADMINISTRATOR\``).then(m => m.delete({timeout: 5000}));
        }
        const getcode = args.join(" ");
        if(!getcode) return message.channel.send(`Please give me code to *evaluate*`);

        if(getcode === 'config') return message.channel.send(`Nice try`).then(c => c.delete({ timeout: 5000}))

        try {
            const getresult = await eval(getcode);
            let output = getresult
            if(typeof result !== 'string') {
                output = inspect(getresult)
            }
            const embed = new MessageEmbed()
            .setDescription(`\`\`\`${output}\`\`\``)
            .setColor(`RED`)
            .setFooter(`© 2021 Firewalk Hosting, All Rights Reserved`)
            message.channel.send(embed)
        } catch (err) {
            console.log(err)
            message.channel.send("Error was accord, it was too long to evaluate")
        }
      }
}