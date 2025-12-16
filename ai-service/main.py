from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="SynergAI - AI Orchestration Engine")

# Enable CORS (allow frontend to access)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data model
class QueryRequest(BaseModel):
    query: str
    user_id: Optional[str] = None

# Model information
MODELS = {
    'chatgpt': {'name': 'ChatGPT', 'specialty': 'general', 'score': 0},
    'claude': {'name': 'Claude', 'specialty': 'research', 'score': 0},
    'gemini': {'name': 'Gemini', 'specialty': 'multimodal', 'score': 0},
    'deepseek': {'name': 'DeepSeek', 'specialty': 'code', 'score': 0},
    'grok': {'name': 'Grok', 'specialty': 'realtime', 'score': 0}
}

# Routes

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "AI Engine is running ✓", "version": "1.0"}

@app.post("/select-model")
async def select_model(data: QueryRequest):
    """Smart model selection based on query analysis"""
    query = data.query.lower()
    
    # Reset scores
    for model in MODELS:
        MODELS[model]['score'] = 0
    
    # Analyze query and score models
    if "code" in query or "python" in query or "javascript" in query or "function" in query:
        MODELS['deepseek']['score'] += 10
    
    if "research" in query or "analysis" in query or "study" in query:
        MODELS['claude']['score'] += 10
    
    if "image" in query or "vision" in query or "picture" in query:
        MODELS['gemini']['score'] += 10
    
    if "news" in query or "today" in query or "current" in query or "latest" in query:
        MODELS['grok']['score'] += 10
    
    if "write" in query or "create" in query or "story" in query:
        MODELS['chatgpt']['score'] += 10
    
    # Default scoring
    for model in MODELS:
        if MODELS[model]['score'] == 0:
            MODELS[model]['score'] = 5
    
    # Find best model
    best_model = max(MODELS, key=lambda x: MODELS[x]['score'])
    
    return {
        "selected_model": best_model,
        "model_name": MODELS[best_model]['name'],
        "confidence": round(MODELS[best_model]['score'] / 10, 2),
        "reason": f"Best choice for {MODELS[best_model]['specialty']} tasks",
        "all_scores": {m: MODELS[m]['score'] for m in MODELS}
    }

@app.post("/analyze")
async def analyze_query(data: QueryRequest):
    """Analyze query complexity and type"""
    query = data.query
    
    # Calculate complexity
    complexity = min(len(query.split()) // 5, 10)
    
    # Determine task type
    task_type = "general"
    if "code" in query.lower():
        task_type = "programming"
    elif "research" in query.lower():
        task_type = "research"
    elif "image" in query.lower():
        task_type = "multimodal"
    elif "news" in query.lower():
        task_type = "realtime"
    
    return {
        "query": query,
        "complexity": complexity,
        "task_type": task_type,
        "word_count": len(query.split()),
        "keywords": query.split()[:5]
    }

@app.post("/orchestrate")
async def orchestrate(data: QueryRequest):
    """Full orchestration: analyze + select model"""
    # Analyze
    analysis = await analyze_query(data)
    
    # Select model
    selection = await select_model(data)
    
    return {
        "query": data.query,
        "analysis": analysis,
        "selected_model": selection['selected_model'],
        "model_name": selection['model_name'],
        "confidence": selection['confidence']
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)