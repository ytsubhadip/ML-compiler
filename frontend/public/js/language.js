const optionL = document.getElementById('inlineFormSelectPref');
let ideTypewriterTimeout;
let lineFadeTimeout;

const codeCache = {
    python: "print('Hello world')",
    cpp: `#include <iostream>\nusing namespace std;\nint main() {\n  cout << "Hello world";\n  return 0;\n}`,
    c: `#include <stdio.h>\nint main() {\n  printf("hello, world");\n  return 0;\n}`,
    java: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello World");\n  }\n}`,
    javascript: `console.log("Hello World");`
};

let currentLang = optionL.value || 'python';

function streamCodeIntoEditor(targetText, speed = 10) {
    clearInterval(ideTypewriterTimeout);
    editor.setValue(""); 
    editor.focus();

    let index = 0;
    ideTypewriterTimeout = setInterval(() => {
        if (index < targetText.length) {
            const char = targetText.charAt(index);
            const doc = editor.getDoc();
            const cursor = doc.getCursor();
            
            doc.replaceRange(char, cursor);
            index++;
        } else {
            clearInterval(ideTypewriterTimeout);
        }
    }, speed);
}

optionL.addEventListener('change', function () {
    const selectedLang = optionL.value.toLowerCase().trim();

    if (selectedLang === "nol") {
        clearInterval(ideTypewriterTimeout);
        editor.setValue("");
        return;
    }

    if (currentLang && currentLang !== "nol") {
        codeCache[currentLang] = editor.getValue();
    }
    
    clearInterval(ideTypewriterTimeout);
    currentLang = selectedLang;
    
    if (currentLang === 'python') {
        editor.setOption("mode", "text/x-python");
    } else if (currentLang === 'cpp' || currentLang === 'c++') {
        editor.setOption("mode", "text/x-c++src");
    } else if (currentLang === 'c') {
        editor.setOption("mode", "text/x-csrc");
    } else if (currentLang === 'java') {
        editor.setOption("mode", "text/x-java");
    } else if (currentLang === 'javascript') {
        editor.setOption("mode", "text/javascript");
    }

    const retrievedCode = codeCache[currentLang];
    if (retrievedCode) {
        streamCodeIntoEditor(retrievedCode, 8); 
    }
});

editor.on("change", (instance, changeObj) => {
    if (changeObj.origin === "+input" || changeObj.origin === "paste") {
        clearTimeout(lineFadeTimeout);
        const currentLine = editor.getDoc().getCursor().line;
        
        editor.removeLineClass(currentLine, "background", "line-fade-out");
        editor.addLineClass(currentLine, "background", "active-typing-line");
        
        lineFadeTimeout = setTimeout(() => {
            editor.removeLineClass(currentLine, "background", "active-typing-line");
            editor.addLineClass(currentLine, "background", "line-fade-out");
        }, 700);
    }
});