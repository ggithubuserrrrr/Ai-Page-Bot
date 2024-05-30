const axios = require('axios');

const apiKey = 'j86bwkwo-8hako-12C'; // This is your API Key
const apiUrl = 'https://liaspark.chatbotcommunity.ltd/@LianeAPI_Reworks/api/sumi'; // API URL

async function sumiAPICommand(question) {
  try {
    const response = await axios.get(apiUrl, {
      params: {
        key: apiKey,
        query: question,
      }
    });
    const message = response.data.message;
    return message.length <= 2000 ? message : splitMessageIntoChunks(message);
  } catch (error) {
    throw new Error(`Sumi API call failed: ${error.message}`);
  }
}

function splitMessageIntoChunks(message) {
  const chunkSize = 2000;
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}

module.exports = { sumiAPICommand };