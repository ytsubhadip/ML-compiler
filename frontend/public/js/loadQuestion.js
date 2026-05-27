//Question load from database 
async function load(){
    const response = await fetch("http://127.0.0.1:8000/question");
    const data = await response.json()

    console.log(data)

    const Question = document.querySelector('#question')
    const Desc = document.querySelector("#description")
    const Example = document.querySelector("#exap")
    const sample = document.querySelector("#sample")

    Question.innerText = data.question
    Desc.innerText = data.description
    
    // Clear initial elements and add cleanly trimmed content
    Example.innerHTML = "";
    sample.innerHTML = "";

    data.example.forEach(ex => {
        Example.innerHTML += `${ex.example_input.trim()}\n${ex.example_output.trim()}\n`;
    });
    data.sample.forEach(sa=>{
        sample.innerHTML += `input : <span id="sample_input">${sa.input}</span>\noutput : <span id="org_input">${sa.output}</span>\n`;
    });
}


load()
