const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

const systemPrompt = `You are a helpful assistant that explains the AI Automation Mastery course. The course teaches people how to master AI automations to integrate them inside businesses. Explain modules, who it’s for, what results they can expect, and answer objections like "I'm not technical" or "I don’t have time." Be warm, helpful, and expert.`;

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ]
    });

    const reply = completion.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error communicating with OpenAI.");
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});
