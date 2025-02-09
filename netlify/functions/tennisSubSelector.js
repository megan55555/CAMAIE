const formidable = require('formidable');
const fs = require('fs');
const fetch = require('node-fetch');

exports.handler = async (event) => {
    try {
        const form = new formidable.IncomingForm();

        const parsed = await new Promise((resolve, reject) => {
            form.parse(event, (err, fields, files) => {
                if (err) reject(err);
                else resolve({ fields, files });
            });
        });

        const { files } = parsed;
        if (!files || !files.rulesFile || !files.teamFile || !files.subsFile) {
            throw new Error('Please upload all required files.');
        }

        // Read the file contents
        const rulesText = fs.readFileSync(files.rulesFile.path, 'utf-8');
        const teamText = fs.readFileSync(files.teamFile.path, 'utf-8');
        const subsText = fs.readFileSync(files.subsFile.path, 'utf-8');

        // Create a prompt for the AI
        const prompt = `
        You are an assistant for a Tennis Club. The club has rules about substitutions, which are provided below.

        **Rules Document**:
        ${rulesText}

        The current team information:
        ${teamText}

        The list of available substitutes:
        ${subsText}

        Please select the most **suitable substitutes** based on the rules. Provide a **clear, structured response** explaining why each substitute is chosen.
        `;

        // Send to AI Model (Example: GPT-4 or Mistral)
        const aiResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`
            },
            body: JSON.stringify({
                model: "mistral-medium",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 300
            })
        });

        const data = await aiResponse.json();

        // Extract the AI-generated response
        const suitableSubs = data.choices ? data.choices[0].message.content : "No suitable substitutes found.";

        return {
            statusCode: 200,
            body: JSON.stringify({ reply: suitableSubs })
        };

    } catch (error) {
        console.error("Error processing files:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};


