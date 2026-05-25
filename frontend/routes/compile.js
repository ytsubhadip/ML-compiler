const express = require("express");
const router = express.Router();
const compiler = require('compilex')

var option = { stats: true }
compiler.init(option)
compiler.init({ stats: true });

router.post("/compiler", function (req, res) {
    const code = req.body.code
    const input = req.body.input
    const lang = req.body.lang
    try {
        if (lang == "CPP") {
            if (!input) {
                var envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };
                compiler.compileCPP(envData, code, function (data) {
                    if (data.output) {
                        res.send(data);
                    }
                    else {
                        res.send({ output: "error" })
                    }

                });
            }
            else {
                var envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };
                compiler.compileCPPWithInput(envData, code, input, function (data) {
                    if (data.output) {
                        res.send(data)
                    }
                    else {
                        res.send({ output: "error" })
                    }
                });
            }
        }
        else if (lang == "java") {
            if (!input) {
                var envData = { OS: "windows", options: { timeout: 10000 } };
                compiler.compileJava(envData, code, function (data) {
                    if (data.output) {
                        res.send(data)
                    }
                    else {
                        res.send({ output: "error" })
                    }
                });
            }
            else {
                var envData = { OS: "windows", options: { timeout: 10000 } };
                compiler.compileJavaWithInput(envData, code, input, function (data) {
                    if (data.output) {
                        res.send(data)
                    }
                    else {
                        res.send({ output: "error" })
                    }
                });
            }
        }
        else if (lang == 'python') {
            if (!input) {
                var envData = { OS: "windows" };
                compiler.compilePython(envData, code, function (data) {
                    if (data.output) {
                        res.send(data)
                    }
                    else {
                        res.send({ output: "error" })
                    }

                });
            }
            else {
                var envData = { OS: "windows" };
                compiler.compilePythonWithInput(envData, code, input, function (data) {
                    if (data.output) {
                        res.send(data)
                    }
                    else {
                        res.send({ output: "error" })
                    }
                });
            }

        }
    }
    catch (e) {
        console.log("error")
    }

})

module.exports = router;