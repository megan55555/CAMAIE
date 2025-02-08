const fetch = require('node-fetch'); // Use require for node-fetch v2

exports.handler = async (event) => {
    try {
        const { message } = JSON.parse(event.body);
        console.log('Received message:', message); // Debug: Log incoming messages

        // Check if API Key is available
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('Missing OpenAI API Key in environment variables.');
        }

        // Make request to OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // Secure API Key
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: message }]
            })
        });

        const data = await response.json();
        console.log('Full OpenAI API response:', JSON.stringify(data, null, 2)); // Debug: Print full response

        // Ensure a valid response
        if (!data.choices || data.choices.length === 0 || !data.choices[0].message) {
            throw new Error(`Invalid OpenAI response: ${JSON.stringify(data)}`);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ reply: data.choices[0].message.content })
        };

    } catch (error) {
        console.error('Error:', error.message); // Debug: Log error for investigation
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || 'Server error.' })
        };
    }
};

