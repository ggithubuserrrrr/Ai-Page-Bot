const axios = require('axios');

module.exports = {
  name: 'claude3',
  description: 'Ask a question to Claude-3 AI',
  author: 'Deku (rest api)',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');

    try {
      const apiUrl = `https://deku-rest-api-3ijr.onrender.com/api/claude-3?q=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);

      // Extracting relevant data from the response
      const { respond, author } = response.data;

      // Split the response into chunks if it exceeds 2000 characters
      const maxMessageLength = 2000;
      if (respond.length > maxMessageLength) {
        const chunks = splitMessageIntoChunks(respond, maxMessageLength);
        chunks.forEach(chunk => {
          sendMessage(senderId, { text: chunk }, pageAccessToken);
        });
      } else {
        sendMessage(senderId, { text: respond }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error calling Claude-3 API:', error);
      sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};

function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}