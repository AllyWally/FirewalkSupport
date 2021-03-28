const config = require('../data/config.json');
let prefix = config.MainBot.prefix

exports.run = async(client, message) => {
    client.setMaxListeners(Infinity)
    if (message.author.bot) return;
    if (message.content.startsWith(prefix)) {
      const args = message.content.slice(prefix.length).split(/ +/);
      const cmdName = args.shift().toLowerCase();
       const commandfile = client.commands.get(cmdName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));
  if(!commandfile) return
      commandfile.run(client,message,args);             
    }
  }
