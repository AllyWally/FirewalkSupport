const { MessageEmbed } = require("discord.js");
const Guild = require(`../models/user`)
const guil = require(`../models/guild`)
const config = require('../data/config.json')
const mongoose = require('mongoose')
module.exports = { 
    name: "mute",
    aliases: ["mute"],
    async run(client, message, args) {
        message.delete()
        if(!message.member.hasPermission("MUTE_MEMBERS")) {
            return message.channel.send(`Permission was denied missing \`MUTE_MEMBERS\``).then(m => m.delete({timeout: 5000}));
        }
        const role = message.guild.roles.cache.find(role => role.name === `${config["Discord-Data"].mutedrole}`)


        const guildDB = await guil.findOne({
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

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!user) return message.channel.send(`User wasn't found!`).then(c => c.delete({ timeout: 5000 }))
        const reason = args.slice(1).join(" ") || "No reason was provided"
        if (user.roles.cache.has(role)) return (message.channel.send(`User was already muted`))
        await Guild.findOne({
            userID: user.id
        }, async (err, guild) => {
            if (err) console.error(err);
            let i = 1;
            if (!guild) {
                    const newGuild = new Guild({
                        _id: mongoose.Types.ObjectId(),
                        guildID: message.guild.id,
                        userID: user.id,
                        content : [
                            {   
                                action: "Mute",
                                moderatorID: message.author.id,
                                reason: reason
                            }
                        ],
                        muteCount: i,
                        warnCount: 0,
                        kickCount: 0,
                        banCount: 0
                    });

                await newGuild.save()
                .then(result => console.log(result))
                .catch(err => console.error(err));
            } else {
                const push = {
                    action: "Mute",
                    moderatorID: message.author.id,
                    kickCount: user.muteCount + 1,
                    reason: reason
                }
                guild.updateOne({
                    muteCount: i + 1,
                })
                guild.content.push(push)
            }
            
            guild.save()
        
        user.roles.add(role)
        const embed = new MessageEmbed()
        .setAuthor(`Action Logs | Mute`)
        .setDescription(`
        **Action:** User Muted
        
        **Muted User:**
        <@${user.id}> - ID: ${user.id} - Hash: ${user.tag}
        
        **Issued By:**
        <@${message.author.id}> - ID: ${message.author.id} - Hash: ${message.author.tag}

        **Reason:**
        ${reason}
        `)
        .setColor(`${config.Embed.mainColor}`)
        .setFooter(config.Embed.mainFooter)
        .setTimestamp()
            logChannel.send(embed)
        });
        }
    }
