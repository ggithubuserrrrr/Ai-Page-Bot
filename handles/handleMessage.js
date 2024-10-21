const fs = require('fs');
const path = require('path');
const request = require('request');
const { sendMessage } = require('./sendMessage');

const commands = new Map();
const commandFiles = fs.readdirSync(path.join(__dirname, '../commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`../commands/${file}`);
  commands.set(command.name, command);
}

// rui: add commands list
async function setupCommands(pageAccessToken) {
  const commandsData = {
    commands: [
      {
        locale: "default",
        commands: Array.from(commands.values()).map(command => ({
          name: command.name,
          description: `${command.description} (by ${command.author})`
        }))
      }
    ]
  };

  return new Promise((resolve, reject) => {
    request({
      uri: `https://graph.facebook.com/v21.0/me/messenger_profile`,
      qs: { access_token: pageAccessToken },
      method: 'POST',
      json: commandsData
    }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        console.log('Commands set successfully:', body);
        resolve(body);
      } else {
        console.error('Error setting commands:', error || body.error);
        reject(error || body.error);
      }
    });
  });
};

async function handleMessage(event, pageAccessToken) {
  const senderId = event.sender.id;
  const messageText = event.message.text.toLowerCase();

  const args = messageText.split(' ');
  const commandName = args.shift();

  if (commands.has(commandName)) {
    const command = commands.get(commandName);
    try {
      await command.execute(senderId, args, pageAccessToken, sendMessage);
    } catch (error) {
      console.error(`Error executing command ${commandName}:`, error);
      sendMessage(senderId, { text: 'There was an error executing that command.' }, pageAccessToken);
    }
  }
}

module.exports = { handleMessage };
