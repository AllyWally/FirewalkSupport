const { MessageEmbed, Message } = require('discord.js');
const mongoose = require('mongoose');
const User = require('../models/user');
const Guild = require('../models/guild')

module.exports = { 
    name: "logs",
    aliases: ["modlogs", "logs"],
    run: async (client, message, args) => {
        message.delete();
        if(!message.member.hasPermission("MUTE_MEMBERS")) {
            return message.channel.send(`Permission was denied missing \`MUTE_MEMBERS\``).then(m => m.delete({timeout: 5000}));
        }
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!user) return message.channel.send(`No user was found`)
        User.findOne({ guildID: message.guild.id, userID: user.user.id, }, async (err, data) => {
            if (err) throw err;
            if (data) {
                const embed = new MessageEmbed()
                .setAuthor(`${user.user.tag} modlogs!`, user.user.displayAvatarURL())
                .setThumbnail(user.user.displayAvatarURL())
                .setColor(`RED`)
                .setTimestamp()
                .setDescription(
                        data.content.map(
                            (w, i) =>
                            `\`${i + 1}\` **-** **Action:** ${w.action}
                            **Moderator:** <@${w.moderatorID}>
                            **User:** <@${user.id}> 
                            **Reason:** ${w.reason}\n\n`)
                    )
                message.channel.send(embed)
            } else {
                message.channel.send('No data was found in the database').then(c => c.delete({timeout: 9000}))
            }
        })
    }
}
