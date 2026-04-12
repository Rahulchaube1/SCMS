from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import List
import os

app = FastAPI()

# Enable CORS for the dashboard
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for mock mode
db_tasks = []

class Task(BaseModel):
    title: str
    description: str

@app.get("/")
async def root():
    return {"message": "Python FastAPI Service is Running (Mock Mode)!"}

@app.get("/tasks", response_model=List[Task])
async def get_tasks():
    return db_tasks

@app.post("/tasks")
async def create_task(task: Task = Body(...)):
    db_tasks.append(task)
    return {"id": "mock_id", **task.dict()}

@app.post("/analyze")
async def analyze_task(task: Task = Body(...)):
    # Simulated AI analysis logic
    analysis_result = {
        "original_title": task.title,
        "complexity_score": len(task.description) % 10,
        "sentiment": "Neutral",
        "cloud_readiness": "High",
        "recommendation": f"Process this task using the {task.title.split()[0]} module."
    }
    return analysis_result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
