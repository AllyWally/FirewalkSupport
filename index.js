const { MessageEmbed, Collection, Client } = require("discord.js");
const client = new Client();
const fs = require('fs');
const config = require('./data/config.json')
const mongoose = require('mongoose')

client.commands = new Collection();
client.events = new Collection();
client.aliases = new Collection();
client.mongoose = require('./utils/mongoose')


fs.readdir('./commands/', (err, files) => {
    if (err) return console.log(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`)
        let commandName = file.split(".")[0];
        client.commands.set(commandName, props)
        if (props.aliases) {
            props.aliases.forEach(alias => {
                client.aliases.set(alias, props)
            })
        }
    })
})

fs.readdir('./events/', (err, file) => {
    if(err) console.log(err);
    file.forEach(file => {
        let eventFunctions = require(`./events/${file}`);
        let Name = file.split(".")[0];
        client.on(Name, (...args) => eventFunctions.run(client, ...args))
    })
})

client.mongoose.init();
client.login(config.MainBot.token)