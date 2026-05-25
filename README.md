# ML-compiler
This is a basically a online code IDE use backend ML for analysis code complexity, find the bug and guide a user.

## Folder Structure
```
ML-compiler/
├─ backend/
│  └─ app.py
├─ frontend/
│  ├─ package.json
│  ├─ server.js
│  └─ public/
│     ├─ ide.html
│     ├─ index.html
│     ├─ asset/
│     ├─ codemirror-5.65.21/
│     ├─ css/
│     └─ js/
├─ temp/
│  ├─ *.py
│  └─ **/*.java
└─ requirements.txt
```

## Tech Stack
- Backend: Python, FastAPI, Pydantic, CORS middleware
- Frontend server: Node.js, Express, compilex
- UI: HTML, CSS, JavaScript, CodeMirror editor
- Environment: Python virtual environment in `myenv`

## Implementation
- FastAPI backend serving API routes
- Node.js + Express frontend server
- Code editor UI built with CodeMirror
- Example question endpoint available at `/question`

## Upcoming Features
- AI code suggestions
- ML complexity analysis
- Bug detection guidance
- Multi-language execution support


