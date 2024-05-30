const { sumiAPICommand } = require('../utils/sumiAPI');

module.exports = {
  name: 'sumi',
  description: 'Execute the Sumi command',
  author: 'Liane Cagara (liaspark)',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');
    try {
      const response = await sumiAPICommand(prompt);
      if (Array.isArray(response)) {
        response.forEach(chunk => sendMessage(senderId, { text: chunk }, pageAccessToken));
      } else {
        sendMessage(senderId, { text: response }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error calling Sumi API:', error);
      sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};