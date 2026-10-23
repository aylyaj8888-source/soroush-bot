const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const BOT_TOKEN = '70651296:W83P518nvcU1CDVAwNCufHb9MpCBYVbQfKU';
const BASE_URL = `https://bot.sapp.ir/v1/${BOT_TOKEN}`;
const WEBHOOK_URL = 'https://soroush-bot-cleaner.onrender.com/webhook';

// لینک مستقیم ویدیو شما
const VIDEO_URL = 'https://s6.uupload.ir/filelink/5pAiScgCFB2s_10b7bfa9ef/1792745965536_287t.mp4';

app.post('/webhook', async (req, res) => {
  res.status(200).send('OK');

  try {
    const update = req.body;
    const text = update?.body || update?.caption || '';
    const toUser = update?.from;

    // وقتی هر کاربری استارت زد یا پیامی داد
    if (toUser && (text === '/start' || text.toLowerCase() === 'start' || text === 'شروع')) {
      await axios.post(`${BASE_URL}/sendMessage`, {
        to: toUser,
        body: 'خوش اومدی! ❤️',
        type: 'video',
        fileUrl: VIDEO_URL
      });

      console.log(`Video sent to user: ${toUser}`);
    }
  } catch (error) {
    console.error('Error sending video:', error?.response?.data || error.message);
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
