import os
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="ML Compiler Core Engine")


origins = [
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "https://ml-compiler-074b.onrender.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "active", "engine": "FastAPI Compiler Matrix"}

@app.get("/question")
async def questio():
    return {
        "question": "Reverse String",
        "description": "Write a function that reverses a string. The input string is given as an array of characters s.",
        "example": [{
            "example_input": 'Input: s = ["h" ,"e" ,"l" ,"l" ,"o"]', 
            "example_output": 'Output: ["o" ,"l" ,"l" ,"e" ,"h"]'
        }],
        "sample": [{
            "input": "hello",
            "output": "olleh"
        }]
    }