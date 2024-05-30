const axios = require('axios');

module.exports = {
  name: 'gpt4o',
  description: 'Interact with GPT-4o or GPT-4',
  author: 'Kim Joseph DG Bien (openai-api',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const model = args.shift() || 'gpt-4o'; // Default to gpt-4 if no model is specified
    const content = args.join(' ');

    const payload = {
      model: model,
      messages: [
        {
          role: 'user',
          content: content
        }
      ],
      apikey: 'sk-4837ecf970cb423faf8fbb1d437602f9' // Replace with your actual API key
    };

    try {
      const response = await axios.post('http://openai-api.replit.app/v1/chat/completions', payload);
      const responseData = response.data;

      if (responseData && responseData.choices && responseData.choices.length > 0) {
        const message = responseData.choices[0].message.content;

        if (message.length > 2000) {
          const chunks = splitMessageIntoChunks(message);
          chunks.forEach(chunk => sendMessage(senderId, { text: chunk }, pageAccessToken));
        } else {
          sendMessage(senderId, { text: message }, pageAccessToken);
        }
      } else {
        console.error('Error: Response from API is empty.');
        sendMessage(senderId, { text: 'Sorry, the response from the API was empty.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error calling GPT-4o API:', error);
      sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};

function splitMessageIntoChunks(message) {
  const chunkSize = 2000;
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}