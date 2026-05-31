/**
 * @file language.js
 * @description Manages CodeMirror editor language context switching, 
 * interactive live typing code line highlights, and character streaming (typewriter effect) 
 * inside the IDE editor panel.
 * 
 * Used in:
 * - /pages/compiler_page/playground.html
 * - /pages/compiler_page/testCompiler.html
 */

/**
 * HTML Select element reference for language picking.
 * @type {HTMLSelectElement}
 */
const optionL = document.getElementById('inlineFormSelectPref');

/**
 * Timeout handle for editor typewriter code streaming simulation.
 * @type {number|null}
 */
let ideTypewriterTimeout;

/**
 * Timeout handle for active line highlight fade animations.
 * @type {number|null}
 */
let lineFadeTimeout;

/**
 * In-memory code buffer cache storing user progress across environment switching.
 * @type {Object.<string, string>}
 */
const codeCache = {
    python: "print('Hello world')",
    cpp: `#include <iostream>\nusing namespace std;\nint main() {\n  cout << "Hello world";\n  return 0;\n}`,
    c: `#include <stdio.h>\nint main() {\n  printf("hello, world");\n  return 0;\n}`,
    java: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello World");\n  }\n}`,
    javascript: `console.log("Hello World");`
};

/**
 * Tracks currently active environment language context. Defaults to Python.
 * @type {string}
 */
let currentLang = optionL.value || 'python';

/**
 * Streams pre-formatted template code snippets into the CodeMirror doc instance
 * with a customizable typewriter velocity effect.
 * 
 * @param {string} targetText - The raw template block code to stream.
 * @param {number} [speed=10] - Char stream delay velocity in milliseconds.
 */
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

/**
 * Event listener triggers runtime environment, styling theme, syntax coloring mode,
 * and pre-populated code template shifts when picking alternative environment selectors.
 */
optionL.addEventListener('change', function () {
    const selectedLang = optionL.value.toLowerCase().trim();

    // If selection is invalid, clear the editor and halt typewriter operations
    if (selectedLang === "nol") {
        clearInterval(ideTypewriterTimeout);
        editor.setValue("");
        return;
    }

    // Cache current content before moving contexts to prevent user data loss
    if (currentLang && currentLang !== "nol") {
        codeCache[currentLang] = editor.getValue();
    }
    
    clearInterval(ideTypewriterTimeout);
    currentLang = selectedLang;
    
    // Dynamically adjust CodeMirror syntax highlighting rules
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

    // Retrieve previous cached state or stream a brand new initial layout template
    const retrievedCode = codeCache[currentLang];
    if (retrievedCode) {
        streamCodeIntoEditor(retrievedCode, 8); 
    }
});

/**
 * CodeMirror instance on-change subscription.
 * Implements a gorgeous neon glow active typing highlight class on the line currently 
 * being modified, automatically fading it out after inactivity timeouts.
 */
editor.on("change", (instance, changeObj) => {
    if (changeObj.origin === "+input" || changeObj.origin === "paste") {
        clearTimeout(lineFadeTimeout);
        const currentLine = editor.getDoc().getCursor().line;
        
        // Remove line fade classes and apply active typing line markers
        editor.removeLineClass(currentLine, "background", "line-fade-out");
        editor.addLineClass(currentLine, "background", "active-typing-line");
        
        // Schedule gradual transition back to neutral states
        lineFadeTimeout = setTimeout(() => {
            editor.removeLineClass(currentLine, "background", "active-typing-line");
            editor.addLineClass(currentLine, "background", "line-fade-out");
        }, 700);
    }
});