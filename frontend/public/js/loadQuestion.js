document.addEventListener("DOMContentLoaded", async () => {
    const questionTitle = document.getElementById("question");
    const questionExample = document.getElementById("exap");
    const questionDescription = document.getElementById("description");
    const questionSample = document.getElementById("sample");

    try {
        const response = await fetch("http://localhost:8000/api/question/active");
        if (!response.ok) throw new Error(`Data pipeline down: Status ${response.status}`);

        const data = await response.json();

        if (data) {
            if (questionTitle) questionTitle.textContent = data.title || "Untitled Problem";
            if (questionDescription) questionDescription.textContent = data.description || "No description provided.";
            
            if (questionExample) {
                questionExample.textContent = data.example 
                    ? (typeof data.example === 'object' ? JSON.stringify(data.example, null, 2) : data.example)
                    : "No test examples specified.";
            }

            if (questionSample) {
                questionSample.textContent = data.sampleOutputs 
                    ? (typeof data.sampleOutputs === 'object' ? JSON.stringify(data.sampleOutputs, null, 2) : data.sampleOutputs)
                    : "Standard tracking constraints active.";
            }
        }

    } catch (err) {
        console.error("Failed to load global workspace problem statement context:", err);
        if (questionTitle) questionTitle.textContent = "Error Loading Question Context";
        if (questionDescription) questionDescription.textContent = "Unable to connect to internal data API layers.";
    }
});