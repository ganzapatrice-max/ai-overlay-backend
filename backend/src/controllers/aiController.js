// src/controllers/aiController.js
const OpenAI = require("openai");
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.askAI = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ message: "Prompt is required" });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: prompt }
      ]
    });

    return res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    next(err);
  }
};

exports.visionAI = async (req, res, next) => {
  try {
    const { imageBase64, prompt } = req.body;

    if (!imageBase64)
      return res.status(400).json({ message: "Image is required" });

    const result = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "input_text", text: prompt || "Describe this image." },
            {
              type: "input_image",
              image_url: imageBase64
            }
          ]
        }
      ]
    });

    return res.json({ reply: result.choices[0].message.content });
  } catch (err) {
    next(err);
  }
};

exports.transcribeAudio = async (req, res, next) => {
  try {
    const { audioBase64 } = req.body;
    if (!audioBase64)
      return res.status(400).json({ message: "audioBase64 is required" });

    const buffer = Buffer.from(audioBase64, "base64");

    const transcription = await client.audio.transcriptions.create({
      file: buffer,
      model: "gpt-4o-mini-transcribe"
    });

    return res.json({ text: transcription.text });
  } catch (err) {
    next(err);
  }
};
