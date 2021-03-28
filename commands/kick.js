const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const User = require('../models/user');
const Guild = require('../models/guild');

module.exports = { 
    name: "kick",
    aliases: ["kick"],
    run: async (client, message, args) => {
        message.delete();
        if(!message.member.hasPermission("MUTE_MEMBERS")) {
            return message.channel.send(`Permission was denied missing \`MUTE_MEMBERS\``).then(m => m.delete({timeout: 5000}));
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

        if (!message.member.hasPermission('KICK_MEMBERS'))
            return message.channel.send('You do not have permission to use this command.').then(m => m.delete({timeout: 5000}));

        if (!member)
            return message.channel.send('I cannot find the specified member. Please mention a member in this Discord server.').then(m => m.delete({timeout: 5000}));

        if (!member.kickable)
            return message.channel.send('This member is not kickable.').then(m => m.delete({timeout: 5000}));

        if (message.member.roles.highest.position < member.roles.highest.position)
            return message.channel.send('You cannot kick someone with a higher role than you.').then(m => m.delete({timeout: 5000}));

            User.findOne({
                guildID: message.guild.id,
                userID: member.id
            }, async (err, user) => {
                if (err) console.error(err);
    
                if (!user) {
                    const newUser = new User({
                        _id: mongoose.Types.ObjectId(),
                        guildID: message.guild.id,
                        userID: user.id,
                        content : [
                            {
                                action: "Kick",
                                moderatorID: message.author.id,
                                reason: reason
                            }
                        ],
                        muteCount: 0,
                        warnCount: 0,
                        kickCount: 1,
                        banCount: 0
                    });
    
                    await newUser.save()
                    .then(result => console.log(result))
                    .catch(err => console.error(err));
                } else {
                    user.updateOne({
                        action: "Kick",
                        moderatorID: message.author.id,
                        kickCount: user.kickCount + 1,
                        reason: reason
                    })
                    .then(result => console.log(result))
                    .catch(err => console.error(err));
                };
            });

            let reason = 'No Reason was given';

            if (args.length > 1) reason = args.slice(1).join(' ');
            
            member.send(`👢You were \`kicked\` from **${message.guild.name}** \n**Reason**: ${reason}.`);
            member.kick(reason);
            message.channel.send(`${member} was **kicked**!`);
            if (!logChannel) {
                return
            } else {
                const embed = new MessageEmbed()
                    .setColor(15158332)
                    .setTitle('User Kicked')
                    .setThumbnail(member.user.avatarURL())
                    .addField('Username', member.user.username)
                    .addField('User ID', member.id)
                    .addField('Kicked by', message.author)
                    .addField('Reason', reason);
    
                return logChannel.send(embed);
            };
        }
    };