const fetch = require('node-fetch'); // Use require for node-fetch v2

exports.handler = async (event) => {
    const { message } = JSON.parse(event.body); // Get the user's message from the request

    try {
        // Call the OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // Use the environment variable for the API key
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: message }]
            })
        });

        const data = await response.json();

        // Return the chatbot's response
        return {
            statusCode: 200,
            body: JSON.stringify({ reply: data.choices[0].message.content })
        };
    } catch (error) {
        console.error('Error:', error); // Log errors for debugging
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || 'Failed to fetch response from OpenAI' })
        };
    }
};


