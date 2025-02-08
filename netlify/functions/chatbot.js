const fetch = require('node-fetch'); // Use require for node-fetch v2

exports.handler = async (event) => {
    try {
        const { message } = JSON.parse(event.body);
        console.log('Received message:', message); // Debugging

        // Check if Mistral API Key is available
        if (!process.env.MISTRAL_API_KEY) {
            throw new Error('Missing Mistral API Key in environment variables.');
        }

        // Make request to Mistral's API
        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}` // Secure API Key
            },
            body: JSON.stringify({
                model: "mistral-medium", // Free-tier model
                messages: [{ role: "user", content: message }],
                max_tokens: 256
            })
        });

        const data = await response.json();
        console.log('Mistral API response:', JSON.stringify(data, null, 2)); // Debugging

        // Ensure valid response
        if (!data.choices || data.choices.length === 0) {
            throw new Error('Invalid response from Mistral AI.');
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ reply: data.choices[0].message.content }) // Extract response
        };

    } catch (error) {
        console.error('Error:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || 'Server error.' })
        };
    }
};

