const chalk = require('chalk');
const config = require('../data/config.json');
exports.run = async(client, message) => {
    console.log(chalk.yellow("================================="));
    console.log(chalk.cyan(`    Logged in as ${client.user.tag}!`));
    console.log(chalk.cyan(`    Made By Allison#2003 & BongLongCS#`));
    console.log(chalk.yellow("================================="));
    const guild = client.guilds.cache.get("812561493110554654")
    client.user.setPresence({
        status: 'dnd',
        activity: {
            name: `http://firewalk.host | ${guild.memberCount} Members`,
            type: 'WATCHING'
        }
    })
}