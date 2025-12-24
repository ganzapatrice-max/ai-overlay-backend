const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4';

if (!OPENAI_API_KEY) {
  console.warn('OPENAI_API_KEY is not set. OpenAI endpoints will fail without it.');
}

const client = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    Authorization: `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  },
  timeout: 60_000
});

async function chat({ messages = [], max_tokens = 512, temperature = 0.2 }) {
  const body = {
    model: OPENAI_MODEL,
    messages,
    max_tokens,
    temperature
  };
  const res = await client.post('/chat/completions', body);
  return res.data;
}

module.exports = { chat };
