from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class Example(BaseModel):
    input: str
    output:str
class Question(BaseModel):
    question: str
    description:str
    exm: list[Example]

@app.get("/")
async def root():
    return {"message": "ML compiler API"}

@app.get("/question")
async def questio():
    return{
        "question": "Reverse String",
        "description":"Write a function that reverses a string. The input string is given as an array of characters s.",
        "example":[{
            "input": 'Input: s = ["h","e","l","l","o"]', 
            "output":'Output: ["o","l","l","e","h"]'
            }]
    }
