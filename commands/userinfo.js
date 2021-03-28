const { MessageEmbed, Message, ReactionEmoji } = require('discord.js');
const mongoose = require('mongoose');
const User = require('../models/user');
const Guild = require('../models/guild')
const pagination = require('discord.js-pagination')
const moment = require('moment')
module.exports = { 
    name: "userinfo",
    aliases: ["query", "userinfo"],
    run: async (client, message, args) => {
        message.delete();
        if(!message.member.hasPermission("MUTE_MEMBERS")) {
            return message.channel.send(`Permission was denied missing \`MUTE_MEMBERS\``).then(m => m.delete({timeout: 5000}));
        }
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!user) return message.channel.send(`No user was found`)

        const page1 = new MessageEmbed()
        .setAuthor(`${user.user.tag} Information`, user.user.displayAvatarURL())
        .setDescription(`Your currently getting the info on ${user}`)
        .setFooter(`Page 1/3`)
        .setColor(`RED`)

        let stat = {
            online: "https://emoji.gg/assets/emoji/9166_online.png",
            idle: "https://emoji.gg/assets/emoji/3929_idle.png",
            dnd: "https://emoji.gg/assets/emoji/2531_dnd.png",
            offline: "https://emoji.gg/assets/emoji/7445_status_offline.png"
          }
          let badges = await user.user.flags
          badges = await badges.toArray();
      
          let newbadges = [];
          badges.forEach(m => {
            newbadges.push(m.replace("_", " "))
          })
      
          let page2 = new MessageEmbed()
            .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
      
          //ACTIVITY
          let array = []
          if (user.user.presence.activities.length) {
      
            let data = user.user.presence.activities;
      
            for (let i = 0; i < data.length; i++) {
              let name = data[i].name || "None"
              let xname = data[i].details || "None"
              let zname = data[i].state || "None"
              let type = data[i].type
      
              array.push(`**${type}** : \`${name} : ${xname} : ${zname}\``)
      
              if (data[i].name === "Spotify") {
                page2.setThumbnail(`https://i.scdn.co/image/${data[i].assets.largeImage.replace("spotify:", "")}`)
              }
      
              page2.setDescription(array.join("\n"))
      
            }
          }
      
            //OTHER STUFF 
            page2.setAuthor(user.user.tag + " Discord Information", user.user.displayAvatarURL({ dynamic: true }))
      
            //CHECK IF USER HAVE NICKNAME
            if (user.nickname !== null) page2.addField("Nickname", user.nickname)
            page2.addField("Joined At", moment(user.user.joinedAt).format("LLLL"))
              .addField("Account Created At", moment(user.user.createdAt).format("LLLL"))
              .addField("Common Information", `**ID:** \`${user.user.id}\`\nDiscriminator: \`${user.user.discriminator}\`\nBot: \`${user.user.bot}\`\nDeleted User: \`${user.deleted}\``)
              .addField(`\n**Permissions**`, `**Roles:** ${user.roles.cache.filter(r => r.id !== user.guild.id).map(roles => `\`${roles.name}\``).join("**, **") || "No Roles Found!"}\n`)
              .addField("Badges", newbadges.join(", ").toLowerCase() || "None")
              .setFooter(`Page 2/3`)
        .setColor(`RED`)

              const page3 = new MessageEmbed()
                page3.setAuthor(`${user.user.tag} modlogs!`, user.user.displayAvatarURL())
                page3.setThumbnail(user.user.displayAvatarURL())
                page3.setColor(`RED`)
                page3.setTimestamp()
                User.findOne({ guildID: message.guild.id, userID: user.user.id, }, async (err, data)=> {
                  if(!data) {
                   page3.setDescription(`No data was found for ${user}`) 
                   console.log(`Below This Message ---------- Userinfo command used --------------- Below This Message`)
                    throw err;
                  }
                  page3.setDescription(
                  
                    data.content.map(
                        (w, i) =>
                        `\`${i + 1}.\`
                        **-** **Action:** ${w.action}
                        **Moderator:** <@${w.moderatorID}>
                        **User:** <@${user.id}> 
                        **Reason:** ${w.reason}\n\n`)
                  ) 
                    
                    })
                  
              
                    
              
                


        

          const pages = [
              page1,
              page2,
              page3
          ]
        
                
        
          const emoji = ["⬅️", "➡️"]

          const timeout = '45000'


          pagination(message, pages, emoji, timeout)
      }
}