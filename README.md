# ML-compiler
ML-compiler is an online code IDE prototype that combines a frontend editor with a backend API to analyze code. It uses:

Python + FastAPI for backend services
Node.js + Express for frontend server functionality
CodeMirror for the in-browser code editor
HTML/CSS/JavaScript for the UI

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


