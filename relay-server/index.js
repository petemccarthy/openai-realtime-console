const { RealtimeRelay } = require('./lib/relay.js');
const express = require('express');
const cors = require('cors');
const Replicate = require('replicate');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

if (!OPENAI_API_KEY) {
  console.error(
    `Environment variable "OPENAI_API_KEY" is required.\n` +
      `Please set it in your .env file.`
  );
  process.exit(1);
}

if (!REPLICATE_API_TOKEN) {
  console.error(
    `Environment variable "REPLICATE_API_TOKEN" is required.\n` +
      `Please set it in your .env file.`
  );
  process.exit(1);
}

const PORT = parseInt(process.env.PORT) || 8081;
const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Initialize Replicate client
const replicate = new Replicate();

// Create endpoint for image generation
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log('Generating image for prompt:', prompt);

    // Create a vintage postcard style prompt
    const enhancedPrompt = `A vintage style postcard of ${prompt}, with vibrant colors and nostalgic charm. The image should have a retro travel poster aesthetic with a classic postcard composition. High quality, detailed, cinematic lighting.`;

    const input = {
      prompt: enhancedPrompt,
      aspect_ratio: "16:9"
    };

    const output = await replicate.run(
      "ideogram-ai/ideogram-v2",
      { input }
    );

    // Convert the stream to a buffer
    const chunks = [];
    const reader = output.getReader();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    const buffer = Buffer.concat(chunks);
    
    // Convert buffer to base64 for sending to frontend
    const base64Image = buffer.toString('base64');
    const imageUrl = `data:image/png;base64,${base64Image}`;
    
    console.log('Generated image as base64');
    res.json({ imageUrl });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start the Express server
const server = app.listen(PORT, () => {
  console.log(`HTTP server listening on http://localhost:${PORT}`);
});

// Start the WebSocket relay
const relay = new RealtimeRelay(OPENAI_API_KEY);
relay.listen(PORT + 1);
