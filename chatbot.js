// DOM Elements
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const messages = document.getElementById('messages');

// Function to display messages
const addMessage = (role, text) => {
    const message = document.createElement('div');
    message.className = role === 'user' ? 'text-right mb-2' : 'text-left mb-2';
    message.innerHTML = `<span class="inline-block p-2 rounded ${
        role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'
    }">${text}</span>`;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight; // Auto-scroll
};

// Event Listener for Sending Messages
sendButton.addEventListener('click', async () => {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    addMessage('user', userMessage); // Show the user's message in the chat
    userInput.value = ''; // Clear the input field

    try {
        const response = await fetch('/.netlify/functions/chatbot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage })
        });

        if (!response.ok) {
            throw new Error('Server error. Please try again later.');
        }

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error);
        }

        addMessage('bot', data.reply || 'No reply received.');
    } catch (error) {
        console.error('Error:', error); // Log the error to the console
        addMessage('bot', `Error: ${error.message}`);
    }
});
