/**
 * @file loadQuestion.js
 * @description Implements robust telemetry fetching and structural formatting of coding 
 * challenges. Seamlessly connects to FastAPI or fallback relative endpoints and injects 
 * descriptions, sample outcomes, constraints, and test scenarios.
 * 
 * Used in:
 * - /pages/compiler_page/testCompiler.html
 */

document.addEventListener("DOMContentLoaded", async () => {
    /**
     * DOM references for question problem sections.
     * @type {HTMLElement|null}
     */
    const questionTitle = document.getElementById("question");
    const questionExample = document.getElementById("exap");
    const questionDescription = document.getElementById("description");
    const questionSample = document.getElementById("sample");

    /**
     * Dynamic origin resolving rules to allow development testing alongside standard servers.
     * @type {string}
     */
    const currentOrigin = window.location.origin; 
    
    /**
     * Target Primary pipeline compiler microservice URL.
     * @type {string}
     */
    const FASTAPI_URL = currentOrigin.includes("localhost") 
        ? "http://localhost:8001/question" 
        : `${currentOrigin}/question`; 

    /**
     * Fallback relative Express URL when primary service is disconnected.
     * @type {string}
     */
    const FALLBACK_URL = "/api/question/active"; 

    /**
     * Async query handler querying specialized JSON question nodes from given REST endpoints.
     * 
     * @param {string} url - Target URL to query.
     * @returns {Promise<Object>} Evaluated JSON question payload.
     * @throws {Error} HTTP Status exception if fetch fails.
     */
    async function tryFetchQuestion(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`);
        return await response.json();
    }

    try {
        let data = null;
        try {
            // Attempt standard API query from the FastAPI compiler service
            data = await tryFetchQuestion(FASTAPI_URL);
        } catch (fastApiErr) {
            console.warn("Primary FastAPI pipeline unavailable, checking relative proxy path...", fastApiErr);
            // Gracefully switch to local proxy endpoints on failure
            data = await tryFetchQuestion(FALLBACK_URL);
        }

        if (data) {
            // Unpack metadata structures (supporting various schema variants from API outputs)
            const titleText = data.question || data.title || "Reverse String";
            const descText = data.description || "Write a function that reverses a string. The input string is given as an array of characters s.";
            const rawExample = data.example;
            const rawSample = data.sample || data.sampleOutputs;

            // Injects problem heading
            if (questionTitle) {
                questionTitle.textContent = titleText;
            }

            // Injects instruction body
            if (questionDescription) {
                questionDescription.textContent = descText;
            }
            
            // Format examples safely (handling string representations, objects, and raw text array configurations)
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

            // Format expected outcomes safely (handling custom sample list configurations)
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
        
        // Final fallback: populate editor workspace with classic "Reverse String" mock statement
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