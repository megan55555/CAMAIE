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

    addMessage('user', userMessage);
    userInput.value = '';

    try {
        const response = await fetch('/.netlify/functions/chatbot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage })
        });

        const data = await response.json();
        addMessage('bot', data.reply || 'Error: No response received.');
    } catch (error) {
        addMessage('bot', 'Error: Unable to connect to the server.');
        console.error(error);
    }
});
