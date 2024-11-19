import { RealtimeRelay } from './lib/relay.js';
import express from 'express';
import cors from 'cors';
import Replicate from 'replicate';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
const replicate = new Replicate({
  auth: REPLICATE_API_TOKEN,
});

// Create endpoint for image generation
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log('Generating image for prompt:', prompt);

    const prediction = await replicate.predictions.create({
      version: "8beff3369e81422112d93b89ca01426147de542cd4684c244b673b105188fe5f",
      input: {
        prompt,
        width: 768,
        height: 512,
        num_outputs: 1,
        scheduler: "K_EULER",
        num_inference_steps: 50,
        guidance_scale: 7.5,
        refine: "expert_ensemble_refiner",
        high_noise_frac: 0.8,
      }
    });

    console.log('Created prediction:', prediction);

    // Wait for the prediction to complete
    let imageUrl;
    while (!imageUrl) {
      const result = await replicate.predictions.get(prediction.id);
      console.log('Prediction status:', result.status);
      
      if (result.status === 'succeeded') {
        imageUrl = result.output[0];
        console.log('Generated image URL:', imageUrl);
        break;
      } else if (result.status === 'failed') {
        throw new Error('Image generation failed');
      }
      
      // Wait a bit before checking again
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

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
