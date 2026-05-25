// run button function
  var code
  document.getElementById("coderun").addEventListener('click', async function (e) {

    console.log(optionL.value)

    if (optionL.value == "noL") {
      alert("Please choose Language")
      return;
    }
    const input = document.getElementById('input')
    const output = document.getElementById('output')
    output.value = "Compiling...."
    code = {
      code: editor.getValue(),
      input: undefined,
      lang: optionL.value
    }
    var oData = await fetch("http://localhost:8000/compiler", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(code)
    })
    var con = await oData.json()
    output.value = con.output
    

    const correct_output = "olleh"
    const user_output =  output.value.trim()

    if (user_output == 'error'){
        alert("Please solve this error")
    }
    else{
       code_check(correct_output  , user_output)
    }

   

  })
    function code_check(e_input, u_input){
     console.log(typeof (e_input), typeof(u_input));
    if(e_input.trim() === u_input.trim()  ){
      
      alert("Code run successuly")

    }
    else{
        alert("code fatgia")
    }
    
  }
