const formidable = require('formidable');
const fs = require('fs');
const mammoth = require('mammoth'); // For Word docs
const pdfParse = require('pdf-parse'); // For PDFs
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

        // Function to extract text from different file types
        async function extractText(file) {
            const filePath = file.path;
            const fileExt = file.name.split('.').pop().toLowerCase();

            if (fileExt === 'txt') {
                return fs.readFileSync(filePath, 'utf-8');
            } else if (fileExt === 'docx') {
                const result = await mammoth.extractRawText({ path: filePath });
                return result.value;
            } else if (fileExt === 'pdf') {
                const data = await pdfParse(fs.readFileSync(filePath));
                return data.text;
            } else {
                throw new Error('Unsupported file type. Please upload .txt, .docx, or .pdf files.');
            }
        }

        // Extract text from the uploaded files
        const rulesText = await extractText(files.rulesFile);
        const teamText = await extractText(files.teamFile);
        const subsText = await extractText(files.subsFile);

        // Create a structured prompt for the AI
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

        // Send to AI Model (Example: Mistral or GPT)
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



