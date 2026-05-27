const {estimateComplexity} = require('../modules/complexity');
const express = require("express");
const { format } = require("path");
const router = express.Router();
const { performance } = require("perf_hooks");


router.post("/compiler", async (req, res) => {
    try {
        const { code, lang, input } = req.body;

        const languageMap = {
            c:50,
            cpp: 54,
            java: 62,
            javascript:63,
            python: 71,
            
        };

        // judge0 API call
        const response = await fetch(
            "https://ce.judge0.com/submissions?wait=true",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    source_code: code,
                    language_id:languageMap[lang.toLowerCase()],
                    stdin: input || ""
                })
            }
        );

        const result = await response.json();

        res.json({
            output:
                result.stdout ||
                result.stderr ||
                result.compile_output,
            status:
                result.status?.description
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

module.exports = router;