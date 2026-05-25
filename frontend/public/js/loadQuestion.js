






async function load(){
    const response = await fetch("http://127.0.0.1:8000/question");
    const data = await response.json()
    console.log(data)
    const Question = document.querySelector('#question')
    const Desc = document.querySelector("#description")
    const Example = document.querySelector("#exap")
    Question.innerText = data.question
    Desc.innerText = data.description
    data.example.forEach(ex => {
        Example.innerHTML +=`
        ${ex.input}
        ${ex.output}
        
        `
    });
    
}
load()
