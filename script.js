// script.js

// This event listener ensures the DOM is fully loaded before the script runs.
document.addEventListener('DOMContentLoaded', () => {
    // Select your HTML elements by their IDs.
    // Replace the IDs below if they are different in your index.html file.
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    // Add a click event listener to your send button.
    sendBtn.addEventListener('click', async () => {
        const userMessage = userInput.value;
        if (userMessage.trim() === '') {
            // Do not send empty messages.
            return;
        }

        // Immediately display the user's message in the chat interface.
        displayMessage(userMessage, 'user');
        
        // Clear the input field for the next message.
        userInput.value = '';

        try {
            // Send the user's message to your back-end server using the fetch API.
            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Send the message as a JSON object.
                body: JSON.stringify({ message: userMessage }),
            });

            // Check if the server response was successful.
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Parse the JSON response from the server.
            const data = await response.json();
            
            // Display the chatbot's response in the chat interface.
            displayMessage(data.botResponse, 'bot');
        } catch (error) {
            // Log the error to the console for debugging.
            console.error('Error with chatbot API:', error);
            
            // Display an error message to the user.
            displayMessage('Sorry, I am having trouble connecting. Please try again later.', 'bot');
        }
    });

    // Function to create and display a new message element.
    function displayMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        
        // Auto-scroll the chatbox to the most recent message.
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});