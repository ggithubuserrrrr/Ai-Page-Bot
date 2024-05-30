const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'help',
  description: 'Show available commands',
  author: 'System',
  execute(senderId, args, pageAccessToken, sendMessage) {
    const commandsDir = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));

    const commands = commandFiles.map(file => {
      const command = require(path.join(commandsDir, file));
      return `⟿ ${command.name}\n  - ${command.description}\n  - Credits: ${command.author}`;
    });

    const totalCommands = commandFiles.length;
    const helpMessage = `Here are the available commands: \nTotal commands: ${totalCommands} \n\n${commands.join('\n\n')}`;
    
    sendMessage(senderId, { text: helpMessage }, pageAccessToken);
  }
};