import 'dotenv/config';
import express from 'express';
import { HfInference } from "@huggingface/inference";
import axios from 'axios';
import cors from 'cors';

const app = express();

// Update CORS configuration
app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const inference = new HfInference(process.env.HUGGINGFACE_API_TOKEN);
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Update the LLAMA_PROMPT to be more precise
const LLAMA_PROMPT = `You are a sentiment analysis expert. Analyze the following text and return only a JSON object with two fields: 'sentiment' (must be exactly "positive" or "negative") and 'confidence' (a number between 0 and 1). Text to analyze: `;

// Add a logging utility that respects test environment
const log = (message, data) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(message, data);
  }
};

async function queryCustomModel(text) {
    try {
        const response = await inference.textClassification({
            model: "arashghsz/my-finetuned-model",
            inputs: text,
            provider: "hf-inference"
        });
        
        log('Raw HF response:', response);

        // Map LABEL_1 to positive, LABEL_0 to negative
        const sentiment = response[0].label === "LABEL_1" ? "positive" : "negative";
        const confidence = parseFloat(response[0].score);

        return {
            sentiment: sentiment,
            confidence: confidence
        };
    } catch (error) {
        log("Error in custom model:", error);
        throw error;
    }
}

async function queryLlamaModel(text) {
    try {
        const response = await axios.post(GROQ_API_URL, 
            {
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: "You are a sentiment analysis expert. Always respond with valid JSON."
                    },
                    {
                        role: "user",
                        content: LLAMA_PROMPT + text
                    }
                ],
                temperature: 0.1,
                max_tokens: 150,
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('Raw Groq response:', JSON.stringify(response.data, null, 2)); // Better logging

        let result;
        try {
            const content = response.data.choices[0].message.content.trim();
            // Handle potential JSON within text
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            const jsonStr = jsonMatch ? jsonMatch[0] : content;
            result = JSON.parse(jsonStr);
        } catch (parseError) {
            console.error('Failed to parse Groq response:', response.data.choices[0].message.content);
            throw new Error('Invalid JSON response from model');
        }

        if (!result.sentiment || !result.confidence) {
            throw new Error('Response missing required fields');
        }

        // Normalize the response
        return {
            sentiment: result.sentiment.toLowerCase(),
            confidence: Math.min(Math.max(parseFloat(result.confidence), 0), 1)
        };
    } catch (error) {
        console.error("Error calling Groq API:", error.response?.data || error.message);
        if (error.response?.status === 404) {
            throw new Error('Invalid model name or API endpoint');
        }
        throw new Error(`Llama model error: ${error.message}`);
    }
}

// Update the analyze endpoint to include better error handling
app.post('/analyze', async (req, res) => {
    try {
        const { text, model } = req.body;
        log('Received request:', { text, model });

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        if (model !== 'custom' && model !== 'llama') {
            return res.status(400).json({ error: 'Invalid model specified' });
        }

        const result = model === 'custom' 
            ? await queryCustomModel(text)
            : await queryLlamaModel(text);

        log('Analysis result:', result);

        // Validate result before sending
        if (!result.sentiment || typeof result.confidence !== 'number') {
            throw new Error('Invalid model response format');
        }

        return res.json(result);

    } catch (error) {
        log('Detailed error:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error.message || 'Unknown error occurred',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Add health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

const PORT = process.env.PORT || 3000;

// Only listen if this file is run directly
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export { app };
