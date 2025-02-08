const fetch = require('node-fetch'); // Use require for node-fetch v2

exports.handler = async (event) => {
    try {
        const { message } = JSON.parse(event.body);
        console.log('Received message:', message); // Debugging

        // Check if Mistral API Key is available
        if (!process.env.MISTRAL_API_KEY) {
            throw new Error('Missing Mistral API Key in environment variables.');
        }

        // Define AI Agent Behavior (Encore Stage School Assistant)
        const systemInstructions = `
        You are the official AI assistant for Encore Stage School.
        You provide detailed and accurate answers to parents' and students' questions about rehearsals, fees, costumes, and school policies.
        Use the following information to answer questions:

        📅 **Rehearsal Schedule**:  
        - Monday: Juniors (Ages 5-8) → 4:00 PM - 5:30 PM  
        - Wednesday: Seniors (Ages 9-14) → 5:00 PM - 7:00 PM  
        - Friday: Elite Group → 6:00 PM - 8:00 PM  

        💰 **Fees**:  
        - One term costs **£200**.  
        - Payment is due at the start of each term.  

        👗 **Costume Requirements**:  
        - Ballet: **Pink leotard, white tights, ballet shoes**.  
        - Jazz: **Black leggings, Encore t-shirt, jazz shoes**.  
        - Drama: **Comfortable clothing, no dress code**.  

        🎭 **Upcoming Performances**:  
        - Christmas Show: **12th December, 7:00 PM** at Encore Theatre.  
        - Spring Recital: **20th March, 6:30 PM** at Main Hall.  

        💡 If you don't know the answer, **ask the user for more details** instead of guessing.
        Always keep responses **clear, friendly, and professional**.

        Start the conversation by greeting the user:  
        "Hello! I'm the Encore Stage School Assistant. How can I help you today?"
        `;

        // Make request to Mistral's API
        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}` // Secure API Key
            },
            body: JSON.stringify({
                model: "mistral-medium", // Free-tier model
                messages: [
                    { role: "system", content: systemInstructions }, // AI Agent's knowledge
                    { role: "user", content: message }
                ],
                max_tokens: 256
            })
        });

        const data = await response.json();
        console.log('Mistral AI response:', JSON.stringify(data, null, 2)); // Debugging

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

