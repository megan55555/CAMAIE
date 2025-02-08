const fetch = require('node-fetch'); // Use require for node-fetch v2

exports.handler = async (event) => {
    try {
        const { message } = JSON.parse(event.body);
        console.log('Received message:', message); // Debugging

        // Check if Claude API Key is available
        if (!process.env.CLAUDE_API_KEY) {
            throw new Error('Missing Claude API Key in environment variables.');
        }

        // Make request to Anthropic's Claude API
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.CLAUDE_API_KEY, // Secure API Key
                'anthropic-version': '2023-06-01' // Ensure correct API version
            },
            body: JSON.stringify({
                model: "claude-2", // Free-tier model
                max_tokens: 256,
                messages: [{ role: "user", content: message }]
            })
        });

        const data = await response.json();
        console.log('Claude AI response:', JSON.stringify(data, null, 2)); // Debugging

        // Ensure valid response
        if (!data.content || data.content.length === 0) {
            throw new Error('Invalid response from Claude AI.');
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ reply: data.content[0].text }) // Extract response
        };

    } catch (error) {
        console.error('Error:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || 'Server error.' })
        };
    }
};

