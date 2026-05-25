 // windows width fix
  var width = window.innerWidth
  editor.setSize(0.6 * width, "400")

  // change according to language choose by user
  var optionL = document.getElementById('inlineFormSelectPref')
  optionL.addEventListener('change', function (e) {

    console.log(optionL.value)
    if (optionL.value == 'python') {
      editor.setOption("mode", "text/x-python")
      editor.setValue("print('Hello world')")
    }

    else if (optionL.value == 'CPP') {
      editor.setOption("mode", "text/x-c++src")
      editor.setValue(`#include <iostream>
using namespace std;
int main() {
  cout << "Hello world";
  return 0;
}`);
    }

    else if (optionL.value == 'C') {
      editor.setOption("mode", "text/x-csrc")
      editor.setValue(`#include <stdio.h>
int main() {
  printf("%s","hello, world");
  return 0;
}`);
    }

    else if (optionL.value == 'java') {
      editor.setOption("mode", "text/x-java")
      editor.setValue(`public class Main {
public static void main(String[] args) {
System.out.println("Hello World");
}
}`);
    }

  })

