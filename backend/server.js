const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Sample AI model data
const models = {
  chatgpt: { name: 'ChatGPT', specialty: 'General Purpose', emoji: '🤖' },
  claude: { name: 'Claude', specialty: 'Research & Analysis', emoji: '🧠' },
  gemini: { name: 'Gemini', specialty: 'Multimodal', emoji: '✨' },
  deepseek: { name: 'DeepSeek', specialty: 'Code & Programming', emoji: '🔍' },
  grok: { name: 'Grok', specialty: 'Real-time Info', emoji: '⚡' }
};

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running ✓', timestamp: new Date() });
});

// Process query
app.post('/api/query', (req, res) => {
  try {
    const { query, model } = req.body;

    // Validate input
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Get model info
    const selectedModel = models[model] || models.chatgpt;

    // Simulate AI response
    const response = {
      response: `Response from ${selectedModel.name} (${selectedModel.emoji}): You asked "${query}". This is a simulated response. In the next step, we'll connect real AI APIs!`,
      model: model || 'chatgpt',
      specialty: selectedModel.specialty,
      cost: parseFloat((Math.random() * 0.08 + 0.02).toFixed(2)),
      responseTime: parseFloat((Math.random() * 3 + 1).toFixed(2)),
      timestamp: new Date()
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all models
app.get('/api/models', (req, res) => {
  res.json(models);
});

// Get analytics (dummy data for now)
app.get('/api/analytics', (req, res) => {
  res.json({
    totalQueries: 156,
    totalCost: 52.35,
    averageAccuracy: 92.5,
    models: {
      chatgpt: 45,
      claude: 38,
      gemini: 35,
      deepseek: 28,
      grok: 10
    },
    lastUpdated: new Date()
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 Test query: POST http://localhost:${PORT}/api/query`);
});