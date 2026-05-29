document.addEventListener("DOMContentLoaded", async () => {
    const questionTitle = document.getElementById("question");
    const questionExample = document.getElementById("exap");
    const questionDescription = document.getElementById("description");
    const questionSample = document.getElementById("sample");

    
    const currentOrigin = window.location.origin; 
    
   
    const FASTAPI_URL = currentOrigin.includes("localhost") 
        ? "http://localhost:8001/question" 
        : `${currentOrigin}/question`; 

    const FALLBACK_URL = "/api/question/active"; 

    async function tryFetchQuestion(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`);
        return await response.json();
    }

    try {
        let data = null;
        try {
           
            data = await tryFetchQuestion(FASTAPI_URL);
        } catch (fastApiErr) {
            console.warn("Primary FastAPI pipeline unavailable, checking relative proxy path...", fastApiErr);
            
            data = await tryFetchQuestion(FALLBACK_URL);
        }

        if (data) {
           
            const titleText = data.question || data.title || "Reverse String";
            const descText = data.description || "Write a function that reverses a string. The input string is given as an array of characters s.";
            const rawExample = data.example;
            const rawSample = data.sample || data.sampleOutputs;

            if (questionTitle) {
                questionTitle.textContent = titleText;
            }

            if (questionDescription) {
                questionDescription.textContent = descText;
            }
            
       
            if (questionExample) {
                let exampleText = "";
                if (rawExample) {
                    if (Array.isArray(rawExample)) {
                        rawExample.forEach((ex, idx) => {
                            if (ex.example_input) exampleText += `${ex.example_input}\n`;
                            if (ex.example_output) exampleText += `${ex.example_output}\n`;
                            if (idx < rawExample.length - 1) exampleText += "\n";
                        });
                    } else if (typeof rawExample === 'object') {
                        exampleText = JSON.stringify(rawExample, null, 2);
                    } else {
                        exampleText = rawExample;
                    }
                } else {
                    exampleText = 'Input: s = ["h","e","l","l","o"]\nOutput: ["o","l","l","e","h"]';
                }
                questionExample.textContent = exampleText;
            }

           
            if (questionSample) {
                let sampleText = "";
                if (rawSample) {
                    if (Array.isArray(rawSample)) {
                        rawSample.forEach((sa, idx) => {
                            if (sa.input) sampleText += `Input: "${sa.input}"\n`;
                            if (sa.output) sampleText += `Output: "${sa.output}"\n`;
                            if (idx < rawSample.length - 1) sampleText += "\n";
                        });
                    } else if (typeof rawSample === 'object') {
                        sampleText = JSON.stringify(rawSample, null, 2);
                    } else {
                        sampleText = rawSample;
                    }
                } else {
                    sampleText = 'Input: "hello"\nOutput: "olleh"';
                }
                questionSample.textContent = sampleText;
            }
        }

    } catch (err) {
        console.error("Failed to load problem statement content from all endpoints:", err);
        
        
        if (questionTitle) questionTitle.textContent = "Reverse String";
        if (questionDescription) {
            questionDescription.textContent = "Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.";
        }
        if (questionExample) {
            questionExample.textContent = 'Input: s = ["h","e","l","l","o"]\nOutput: ["o","l","l","e","h"]';
        }
        if (questionSample) {
            questionSample.textContent = 'Input: "hello"\nOutput: "olleh"';
        }
    }
});