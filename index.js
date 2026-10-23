const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const BOT_TOKEN = '70651296:W83P518nvcU1CDVAwNCufHb9MpCBYVbQfKU';
const BASE_URL = `https://bot.sapp.ir/v1/${BOT_TOKEN}`;
const WEBHOOK_URL = 'https://soroush-bot-cleaner.onrender.com/webhook';

const BAD_WORDS = ['تبلیغ', 'شارژ رایگان', 'فروش اکانت', 'قمار', 'صیغه'];
const LINK_REGEX = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.(ir|com|org|net|me|xyz|io))/i;
const ID_REGEX = /@[a-zA-Z0-9_]+/i;

app.post('/webhook', async (req, res) => {
  res.status(200).send('OK');

  try {
    const update = req.body;
    const text = update?.body || update?.caption || '';
    const messageId = update?.messageId;
    const chatId = update?.chatId || update?.from;

    if (!text || !messageId) return;

    const hasLink = LINK_REGEX.test(text);
    const hasId = ID_REGEX.test(text);
    const hasBadWord = BAD_WORDS.some(w => text.includes(w));

    if (hasLink || hasId || hasBadWord) {
      await axios.post(`${BASE_URL}/deleteMessage`, {
        chatId: chatId,
        messageId: messageId
      });
      console.log(`Deleted message: ${messageId}`);
    }
  } catch (error) {
    console.error('Error deleting message:', error?.response?.data || error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  try {
    const res = await axios.post(`${BASE_URL}/setWebhook?url=${WEBHOOK_URL}`);
    console.log('Webhook set successfully:', res.data);
  } catch (err) {
    console.error('Webhook set error:', err?.response?.data || err.message);
  }
});
