const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const User = require('../models/user');
const Guild = require('../models/guild')
const config = require('../data/config.json')
module.exports = { 
    name: "ban",
    aliases: ["ban"],
    run: async (client, message, args) => {
        message.delete();
        if(!message.member.hasPermission("BAN_MEMBERS")) {
            return message.channel.send(`Permission was denied missing \`BAN_MEMBERS\``).then(m => m.delete({timeout: 5000}));
        }
        const member = message.mentions.members.first();

        const guildDB = await Guild.findOne({
            guildID: message.guild.id
        }, async (err, guild) => {
            if (err) console.error(err);

            if (!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectId(), 
                    guildID: message.guild.id,
                    guildName: message.guild.name,
                    logChannelID: null
                });

                await newGuild.save()
                .then(result => console.log(result))
                .catch(err => console.error(err));
            }
        });

        const logChannel = message.guild.channels.cache.get(guildDB.logChannelID);

        if (!message.member.hasPermission('BAN_MEMBERS'))
            return message.channel.send('You do not have permission to use this command.').then(m => m.delete({timeout: 5000}));

        if (!member)
            return message.channel.send('I cannot find the specified member. Please mention a member in this Discord server.').then(m => m.delete({timeout: 5000}));

        if (!member.bannable)
            return message.channel.send('This member is not bannable.').then(m => m.delete({timeout: 5000}));

        if (message.member.roles.highest.position < member.roles.highest.position)
            return message.channel.send('You cannot ban someone with a higher role than you.').then(m => m.delete({timeout: 5000}));

        User.findOne({
            guildID: message.guild.id,
            userID: message.id
        }, async (err, user) => {
            if (err) console.error(err);

            if (!user) {
                const newUser = new User({
                    _id: mongoose.Types.ObjectId(),
                    guildID: message.guild.id,
                    userID: user.id,
                    content : [
                        {
                            action: "Ban",
                            moderatorID: message.author.id,
                            reason: reason
                        }
                    ],
                    muteCount: 0,
                    warnCount: 0,
                    kickCount: 0,
                    banCount: 1
                });

                await newUser.save()
                .then(result => console.log(result))
                .catch(err => console.error(err));
            } else {
                user.updateOne({
                    action: "Ban",
                    moderatorID: message.author.id,
                    reason: reason,
                    kickCount: user.banCount + 1
                })
                .then(result => console.log(result))
                .catch(err => console.error(err));
            };
        });
                let reason = 'No reason specified';

        if (args.length > 1) reason = args.slice(1).join(' ');

        member.send(`🔨You were \`banned\` from **${message.guild.name}** \n**Reason**: ${reason}.`);
        member.ban({ reason: reason });
        message.channel.send(`${member} was **banned**!`);
        if (!logChannel) {
            return
        } else {
            const embed = new MessageEmbed()
            .setAuthor(`Action Logs | Banned`)
            .setThumbnail(member.user.displayAvatarURL())
            .setDescription(`
            **Action:** User Banned
            
            **Banned User:**
            <@${member.id}> - ID: ${member.id} - Hash: ${member.tag}
            
            **Issued By:**
            <@${message.author.id}> - ID: ${message.author.id} - Hash: ${message.author.tag}
    
            **Reason for ban:**
            ${reason}
            `)
            .setColor(`${config.Embed.mainColor}`)
            .setFooter(config.Embed.mainFooter)
            .setTimestamp()

            return logChannel.send(embed);

                }
            }
        }
    
