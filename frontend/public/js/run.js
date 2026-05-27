var code
document.getElementById("coderun").addEventListener('click', async function (e) {
  e.preventDefault()

  const optionL = document.getElementById("inlineFormSelectPref");
  const inputElement = document.getElementById('sample_input');
  const expectedOutputElement = document.getElementById('org_input');
  const output = document.getElementById('output');

  if (optionL.value == "noL") {
    alert("Please choose Language")
    return;
  }

  const statusEl = document.getElementById('consoleStatus');
  statusEl.textContent = "Running";
  statusEl.className = "badge-status badge-status-running";

  output.value = "Compiling and running...."
  output.classList.remove("console-error-text", "console-success-text");

  code = {
    code: editor.getValue(),
    input: "",
    lang: optionL.value
  }

  try {
    var response = await fetch("http://localhost:8000/compiler", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(code)
    })

    var con = await response.json()
    console.log("Compiler Response:", con)

    // Check if error is present, display error and style accordingly
    if (con.error) {
      output.value = con.error;
      output.classList.add("console-error-text");
      output.classList.remove("console-success-text");
      statusEl.textContent = "Rejected";
      statusEl.className = "badge-status badge-status-rejected";
      
    }
    else {
      // Clean up stdout output and display
      const rawOutput = con.output || "";
      output.value = rawOutput
      statusEl.textContent = "Accept";
      output.classList.add("console-success-text");
      output.classList.remove("console-error-text");
    }

    // Populate execution metrics
    const execEl = document.getElementById('execTime');
    const compEl = document.getElementById('complexity');
    const user_output = output.value.trim();
  }

  catch (err) {
    console.error("Compilation fetch failed:", err);
    output.value = "Execution Error: Unable to reach the compiler backend. Please verify that your servers are running.";
    output.classList.add("console-error-text");

    if (statusEl) {
      statusEl.textContent = "Rejected";
      statusEl.className = "badge-status badge-status-rejected";
    }
  }
})

