var code;
let widgetTimeout;
let consoleTimeout;

function typeWidgetText(element, text, speed = 40) {
    clearTimeout(widgetTimeout);
    element.textContent = "";
    let i = 0;
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            widgetTimeout = setTimeout(type, speed);
        }
    }
    type();
}

function typeConsoleOutput(textarea, text, speed = 5) {
    clearTimeout(consoleTimeout);
    textarea.value = "";
    let i = 0;
    function type() {
        if (i < text.length) {
            textarea.value += text.charAt(i);
            textarea.scrollTop = textarea.scrollHeight;
            i++;
            consoleTimeout = setTimeout(type, speed);
        }
    }
    type();
}

function updateConsolePet(state) {
    const consoleHeader = document.querySelector('.console-header');
    if (!consoleHeader) return;

    let pet = document.getElementById('ide-pet');
    if (!pet) {
        pet = document.createElement('div');
        pet.id = 'ide-pet';
        pet.style.cssText = `
          margin-left: auto;
          margin-right: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 14px;
          border-radius: 12px;
          background: #1a1d24;
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        `;
        const statusEl = document.getElementById('consoleStatus');
        consoleHeader.insertBefore(pet, statusEl);
    }

    if (!pet.innerHTML) {
        pet.innerHTML = `
          <span id="pet-avatar" style="font-size: 1.2rem; transition: transform 0.3s ease;">💤</span>
          <span id="pet-status" style="font-size: 0.85rem; font-family: 'Outfit', sans-serif; font-weight: 500; min-width: 100px; color: #fff;"></span>
        `;
    }

    const avatar = document.getElementById('pet-avatar');
    const statusText = document.getElementById('pet-status');

    if (state === 'idle') {
        avatar.textContent = "💤";
        avatar.style.transform = "scale(1)";
        pet.style.borderColor = "rgba(255, 255, 255, 0.05)";
        pet.style.boxShadow = "none";
        typeWidgetText(statusText, "Chillin'...");
        statusText.style.color = "#888";
    } 
    else if (state === 'running') {
        avatar.textContent = "⚡";
        avatar.style.transform = "scale(1.2) rotate(15deg)";
        pet.style.borderColor = "#ffc107";
        pet.style.boxShadow = "0 0 12px rgba(255, 193, 7, 0.2)";
        typeWidgetText(statusText, "Crunching bytes...", 30);
        statusText.style.color = "#ffc107";
    } 
    else if (state === 'success') {
        avatar.textContent = "✨ 😺";
        avatar.style.transform = "scale(1.1) translateY(-2px)";
        pet.style.borderColor = "#2ec866";
        pet.style.boxShadow = "0 0 14px rgba(46, 200, 102, 0.25)";
        typeWidgetText(statusText, "Clean compile!", 40);
        statusText.style.color = "#2ec866";
    } 
    else if (state === 'error') {
        avatar.textContent = "😈 🔥";
        avatar.style.transform = "scale(1.1)";
        pet.style.borderColor = "#dc3545";
        pet.style.boxShadow = "0 0 14px rgba(220, 53, 69, 0.25)";
        typeWidgetText(statusText, "Bug found!", 40);
        statusText.style.color = "#dc3545";
    }
}

function showModernToast(message, isSuccess = false) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = 'position: fixed; bottom: 24px; right: 24px; z-index: 9999; display: flex; flex-direction: column; gap: 12px;';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.style.cssText = `
      background: #16181d;
      border-left: 4px solid ${isSuccess ? '#2ec866' : '#dc3545'};
      color: #fff;
      padding: 16px 20px;
      border-radius: 8px;
      font-family: 'Outfit', sans-serif;
      font-size: 0.9rem;
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      gap: 14px;
      opacity: 0;
      transform: translateX(40px);
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    `;
    
    const iconColor = isSuccess ? '#2ec866' : '#dc3545';
    const icon = isSuccess ? 'bi-check-circle-fill' : 'bi-slash-circle-fill';
    toast.innerHTML = `<i class="bi ${icon}" style="color: ${iconColor}; font-size: 1.1rem;"></i> <span style="letter-spacing: 0.2px;">${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 50);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(40px)';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

document.addEventListener('DOMContentLoaded', () => updateConsolePet('idle'));

document.getElementById("coderun").addEventListener('click', async function (e) {
    e.preventDefault();

    const optionLElement = document.getElementById("inlineFormSelectPref");
    const output = document.getElementById('output');
    const statusEl = document.getElementById('consoleStatus');
    const inputEl = document.getElementById("customInput");

    if (!optionLElement || optionLElement.value === "noL") {
        showModernToast("Please select a valid environment language context.", false);
        return;
    }

    if (statusEl) {
        statusEl.textContent = "Running";
        statusEl.className = "badge-status badge-status-running";
    }

    updateConsolePet('running');
    clearTimeout(consoleTimeout);
    output.value = "Compiling and running....";
    output.classList.remove("console-error-text", "console-success-text");

    code = {
        code: editor.getValue(),
        input: inputEl ? inputEl.value : "",
        lang: optionLElement.value.toLowerCase().trim()
    };

    try {
        const response = await fetch("http://localhost:8000/compiler", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(code)
        });

        if (!response.ok) throw new Error(`HTTP Matrix Error: ${response.status}`);

        const con = await response.json();

        if (con.error) {
            output.classList.add("console-error-text");
            output.classList.remove("console-success-text");

            if (statusEl) {
                statusEl.textContent = "Rejected";
                statusEl.className = "badge-status badge-status-rejected";
            }
            
            updateConsolePet('error');
            typeConsoleOutput(output, con.error, 4); 
            showModernToast("Execution halted: Structural bugs discovered inside compiler path.", false);
        } 
        else {
            output.classList.add("console-success-text");
            output.classList.remove("console-error-text");

            if (statusEl) {
                statusEl.textContent = "Accepted"; 
                statusEl.className = "badge-status badge-status-success"; 
            }

            updateConsolePet('success');
            const rawOutput = con.output || "";
            const formattedOutput = typeof rawOutput === 'object' ? JSON.stringify(rawOutput, null, 2) : rawOutput;
            
            typeConsoleOutput(output, formattedOutput, 6);
            showModernToast("Build finished cleanly. Scripts evaluated successfully.", true);
        }

        const execEl = document.getElementById('execTime');
        const compEl = document.getElementById('complexity');
        const execVal = con.execTimeMs ?? con.executionTime ?? con.executionTimeMs ?? null;
        
        if (execEl) execEl.textContent = execVal != null ? execVal : "-";
        if (compEl) compEl.textContent = con.complexity ? con.complexity : "-";

    } catch (err) {
        console.error("Pipeline failure:", err);
        output.classList.add("console-error-text");

        if (statusEl) {
            statusEl.textContent = "Rejected";
            statusEl.className = "badge-status badge-status-rejected";
        }

        updateConsolePet('error');
        typeConsoleOutput(output, `Runtime Interrupt: ${err.message}. Failed to bind compiler instances.`, 5);
        showModernToast("Network Exception: Compiler backplane unreachable.", false);
    }
});