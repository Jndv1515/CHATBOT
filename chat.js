// Get DOM elements
const messageListContainer = document.getElementById('message-list-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatInputContainer = document.getElementById('chat-input-container');
const faqListContainer = document.getElementById('faq-list-container');
const historyListContainer = document.getElementById('history-list-container');
const aiTalkModeBtn = document.getElementById('ai-talk-mode-btn');
const faqModeBtn = document.getElementById('faq-mode-btn');
const historyModeBtn = document.getElementById('history-mode-btn');
const clearChatBtn = document.getElementById('clear-chat-button');
const saveChatBtn = document.getElementById('save-chat-button');
const faqHeader = document.getElementById('faq-header');

// Get the legal agreement and main chat containers
const legalAgreementContainer = document.getElementById('legal-agreement-container');
const chatContainer = document.getElementById('chat-container');
const agreeButton = document.getElementById('agree-button');
const creditCounter = document.getElementById('credit-counter');

// Dark Mode Elements
const darkModeToggle = document.getElementById('dark-mode-toggle');
const lightModeIcon = document.getElementById('light-mode-icon');
const darkModeIcon = document.getElementById('dark-mode-icon');

// State variables
let messages = [];
let isTyping = false;
let currentMode = 'aiTalk'; // 'aiTalk', 'faq', or 'history'
let credits = 10; // Initialize credits
let pastConversations = []; // Array to store past conversations

// Define the chatbot's avatar path
const chatbotAvatar = 'bot_icon.png';

// Sample FAQ data
const faqData = [
    {
        question: "What are your Operating Hours?",
        answer: "Our operating hours are Monday to Friday, 9:00 AM to 5:00 PM (local time). We are closed on weekends and public holidays."
    },
    {
        question: "How do I get a transcript of my chat?",
        answer: "While we don't offer chat transcripts for download, you can view all your past conversations in the **Chat History** tab. Simply navigate to the 'History' tab to see a list of your previous chats."
    },
    {
        question: "How do I earn more credits?",
        answer: "Currently, credits are fixed at 10. You will need to wait for a developer to implement more features so that you can earn more credits."
    },
    {
        question: "What happens when I run out of credits?",
        answer: "When you run out of credits, you will no longer be able to use the AI Talk mode. However, you can still use the FAQ mode, which does not require any credits."
    },
    {
        question: "Is my conversation private?",
        answer: "Your conversation history is safe and is not stored within our system. This ensures your privacy and that all your chats remain confidential."
    },
    {
        question: "Can I speak to a human agent?",
        answer: "For a more in-depth conversation or assistance from a human, please submit a ticket on the homepage of our website and wait for an available agent to respond."
    },
    {
        question: "What data do you collect?",
        answer: "We do not collect any personal data or information from your conversations. All chats are temporary and are not stored on our servers."
    },
    {
        question: "How can I provide feedback?",
        answer: "We would love to hear your feedback! You can email our support team at support@helpr.com with any suggestions or issues you've encountered."
    },
    {
        question: "The chatbot is not responding, what should I do?",
        answer: "If the chatbot is not responding, please check your internet connection. If the issue persists, try clearing the chat and starting a new conversation. If all else fails, you can submit a ticket to speak with a human agent."
    }
];

/**
 * Renders all messages in the message list container.
 * Clears existing messages and appends new ones.
 */
function renderMessages() {
    messageListContainer.innerHTML = '';
    messages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.className = `flex mb-4 ${msg.isOwnMessage ? 'justify-end' : 'justify-start'}`;

        if (!msg.isOwnMessage) {
            const avatarImg = document.createElement('img');
            avatarImg.src = msg.avatar || chatbotAvatar;
            avatarImg.alt = `${msg.sender}'s Icon`;
            avatarImg.className = 'w-8 h-8 mr-2 self-end';
            messageElement.appendChild(avatarImg);
        }

        const messageBubble = document.createElement('div');
        messageBubble.className = `max-w-[70%] p-3 rounded-xl shadow-sm text-sm message-bubble ${
            msg.isOwnMessage
                ? 'bg-blue-500 text-white rounded-br-none'
                : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`;
        messageBubble.textContent = msg.message;
        messageElement.appendChild(messageBubble);

        messageListContainer.appendChild(messageElement);
    });

    if (isTyping) {
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'flex justify-start mb-4';
        typingIndicator.innerHTML = `
            <img src="${chatbotAvatar}" alt="Helpr's Icon" class="w-8 h-8 mr-2 self-end">
            <div class="bg-gray-200 text-gray-800 p-3 rounded-xl rounded-bl-none shadow-sm text-sm flex items-center space-x-1">
                <span class="typing-dot w-2 h-2 bg-gray-500 rounded-full"></span>
                <span class="typing-dot w-2 h-2 bg-gray-500 rounded-full"></span>
                <span class="typing-dot w-2 h-2 bg-gray-500 rounded-full"></span>
            </div>
        `;
        messageListContainer.appendChild(typingIndicator);
    }

    messageListContainer.scrollTop = messageListContainer.scrollHeight;
}

/**
 * Renders the FAQ list.
 */
function renderFaqList() {
    faqListContainer.innerHTML = '';

    const header = document.createElement('h2');
    header.id = 'faq-header';
    header.className = 'text-xl font-bold p-4 pb-2 text-center text-primary';
    header.textContent = 'Frequently Asked Questions';
    faqListContainer.appendChild(header);

    faqData.forEach(faq => {
        const faqItem = document.createElement('div');
        faqItem.className = 'faq-item';
        faqItem.textContent = faq.question;
        faqItem.addEventListener('click', () => displayFaqAnswer(faq));
        faqListContainer.appendChild(faqItem);
    });
}

/**
 * Displays the answer for a clicked FAQ question.
 * @param {object} faq - The FAQ object containing question and answer.
 */
function displayFaqAnswer(faq) {
    faqListContainer.innerHTML = '';

    const answerContainer = document.createElement('div');
    answerContainer.className = 'p-4 bg-white rounded-xl shadow-md mb-4';

    const questionTitle = document.createElement('h3');
    questionTitle.className = 'font-semibold text-lg text-gray-800 mb-2';
    questionTitle.textContent = faq.question;

    const answerText = document.createElement('p');
    answerText.className = 'text-gray-700';
    answerText.innerHTML = faq.answer;

    answerContainer.appendChild(questionTitle);
    answerContainer.appendChild(answerText);
    faqListContainer.appendChild(answerContainer);

    // Conditionally add a button to switch to history mode for the specific FAQ
    if (faq.question === "How do I get a transcript of my chat?") {
        const historyButton = document.createElement('button');
        historyButton.textContent = 'Go to Chat History';
        historyButton.className = 'px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm shadow mr-2';
        historyButton.addEventListener('click', () => switchMode('history'));
        faqListContainer.appendChild(historyButton);
    }

    const backButton = document.createElement('button');
    backButton.textContent = 'Back to FAQs';
    backButton.className = 'px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 text-sm shadow';
    backButton.addEventListener('click', () => renderFaqList());

    faqListContainer.appendChild(backButton);

    faqListContainer.scrollTop = 0;
}

/**
 * Saves the current conversation to localStorage.
 */
function saveConversation() {
    if (messages.length > 0) {
        const conversationSummary = {
            id: Date.now(),
            date: new Date().toLocaleString(),
            snippet: messages[0].message.substring(0, 50) + (messages[0].message.length > 50 ? '...' : ''),
            messages: messages
        };

        pastConversations.unshift(conversationSummary);

        localStorage.setItem('pastConversations', JSON.stringify(pastConversations));
    }
}

/**
 * Loads conversations from localStorage.
 */
function loadConversations() {
    const storedConversations = localStorage.getItem('pastConversations');
    if (storedConversations) {
        pastConversations = JSON.parse(storedConversations);
    }
}

/**
 * Renders the list of past conversations.
 */
function renderHistoryList() {
    historyListContainer.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'flex justify-between items-center p-4 pb-2';
    header.innerHTML = `
        <h2 class="text-xl font-bold text-primary">Chat History</h2>
        <button id="clear-all-history-button" class="text-red-500 hover:text-red-700 text-sm font-semibold">
            Clear All
        </button>
    `;
    historyListContainer.appendChild(header);

    document.getElementById('clear-all-history-button').addEventListener('click', () => {
        if (confirm('Are you sure you want to delete all chat history? This cannot be undone.')) {
            clearAllHistory();
        }
    });

    if (pastConversations.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'text-center text-secondary mt-4';
        emptyMessage.textContent = 'No past conversations found.';
        historyListContainer.appendChild(emptyMessage);
    } else {
        pastConversations.forEach(conversation => {
            const historyItem = document.createElement('div');
            historyItem.className = 'flex items-center justify-between history-item';

            const content = document.createElement('div');
            content.className = 'flex-1 cursor-pointer';
            content.innerHTML = `
                <h3 class="font-semibold text-base text-primary">${conversation.date}</h3>
                <p class="text-sm text-secondary mt-1">${conversation.snippet}</p>
            `;
            content.addEventListener('click', () => {
                renderPastConversation(conversation);
            });
            
            const deleteButton = document.createElement('button');
            deleteButton.className = 'p-2 ml-2 rounded-lg hover:bg-gray-300 transition-colors duration-200 ease-in-out';
            deleteButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2">
                    <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
                </svg>
            `;
            deleteButton.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevents the parent div's click event from firing
                if (confirm('Are you sure you want to delete this conversation?')) {
                    deleteConversation(conversation.id);
                }
            });
            
            historyItem.appendChild(content);
            historyItem.appendChild(deleteButton);
            historyListContainer.appendChild(historyItem);
        });
    }
}

/**
 * Deletes a single conversation by its ID.
 * @param {number} id - The ID of the conversation to delete.
 */
function deleteConversation(id) {
    pastConversations = pastConversations.filter(conv => conv.id !== id);
    localStorage.setItem('pastConversations', JSON.stringify(pastConversations));
    renderHistoryList();
}

/**
 * Clears all chat history.
 */
function clearAllHistory() {
    pastConversations = [];
    localStorage.removeItem('pastConversations');
    renderHistoryList();
}

/**
 * Renders a specific past conversation in a read-only view.
 * @param {object} conversation - The conversation object to display.
 */
function renderPastConversation(conversation) {
    historyListContainer.innerHTML = '';

    const backButton = document.createElement('button');
    backButton.textContent = 'Back to History';
    backButton.className = 'px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 text-sm shadow mb-4';
    backButton.addEventListener('click', () => renderHistoryList());
    historyListContainer.appendChild(backButton);
    
    // Create a new container to hold the read-only messages
    const conversationMessagesContainer = document.createElement('div');
    conversationMessagesContainer.className = 'flex flex-col space-y-4';

    conversation.messages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.className = `flex mb-4 ${msg.isOwnMessage ? 'justify-end' : 'justify-start'}`;

        if (!msg.isOwnMessage) {
            const avatarImg = document.createElement('img');
            avatarImg.src = msg.avatar || chatbotAvatar;
            avatarImg.alt = `${msg.sender}'s Icon`;
            avatarImg.className = 'w-8 h-8 mr-2 self-end';
            messageElement.appendChild(avatarImg);
        }

        const messageBubble = document.createElement('div');
        messageBubble.className = `max-w-[70%] p-3 rounded-xl shadow-sm text-sm message-bubble ${
            msg.isOwnMessage
                ? 'bg-blue-500 text-white rounded-br-none'
                : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`;
        messageBubble.textContent = msg.message;
        messageElement.appendChild(messageBubble);

        conversationMessagesContainer.appendChild(messageElement);
    });
    
    historyListContainer.appendChild(conversationMessagesContainer);
    historyListContainer.scrollTop = historyListContainer.scrollHeight;
}

/**
 * Updates the credit counter in the UI.
 */
function updateCreditCounter() {
    creditCounter.textContent = credits;
    checkCreditsAndDisableInput();
}

/**
 * Checks if credits are zero and disables the input field and button.
 */
function checkCreditsAndDisableInput() {
    if (credits <= 0) {
        messageInput.placeholder = "You have no credits left.";
        messageInput.disabled = true;
        sendButton.disabled = true;
    } else {
        messageInput.placeholder = "Type your message...";
        messageInput.disabled = false;
        sendButton.disabled = false;
    }
}

/**
 * Switches the current chat mode between 'aiTalk', 'faq', and 'history'.
 * @param {string} mode - The mode to switch to.
 */
function switchMode(mode) {
    currentMode = mode;
    const allModeButtons = [aiTalkModeBtn, faqModeBtn, historyModeBtn];
    allModeButtons.forEach(btn => btn.classList.remove('active'));

    messageListContainer.classList.add('hidden');
    faqListContainer.classList.add('hidden');
    historyListContainer.classList.add('hidden');
    chatInputContainer.classList.add('hidden');

    if (currentMode === 'aiTalk') {
        aiTalkModeBtn.classList.add('active');
        messageListContainer.classList.remove('hidden');
        chatInputContainer.classList.remove('hidden');
        renderMessages();
        checkCreditsAndDisableInput();
    } else if (currentMode === 'faq') {
        faqModeBtn.classList.add('active');
        faqListContainer.classList.remove('hidden');
        renderFaqList();
    } else if (currentMode === 'history') {
        historyModeBtn.classList.add('active');
        historyListContainer.classList.remove('hidden');
        renderHistoryList();
    }
}

/**
 * Function to clear the conversation
 */
function clearConversation() {
    messages = [];
    renderMessages();
}

/**
 * Toggles dark mode on and off.
 */
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        lightModeIcon.classList.add('hidden');
        darkModeIcon.classList.remove('hidden');
    } else {
        localStorage.setItem('theme', 'light');
        lightModeIcon.classList.remove('hidden');
        darkModeIcon.classList.add('hidden');
    }
}

// Event Listeners for mode buttons
aiTalkModeBtn.addEventListener('click', () => switchMode('aiTalk'));
faqModeBtn.addEventListener('click', () => switchMode('faq'));
historyModeBtn.addEventListener('click', () => switchMode('history'));

// Event Listeners for chat input
sendButton.addEventListener('click', () => {
    handleSendMessage(messageInput.value);
});

messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && !isTyping) {
        handleSendMessage(messageInput.value);
    }
});

// Event listener for the save chat button
saveChatBtn.addEventListener('click', saveConversation);

// Event listener for the clear chat button
clearChatBtn.addEventListener('click', clearConversation);

// Event listener for the dark mode toggle button
darkModeToggle.addEventListener('click', toggleDarkMode);


/**
 * Handles sending a message from the user in AI Talk mode.
 * @param {string} messageText - The text of the message to send.
 */
async function handleSendMessage(messageText) {
    if (!messageText.trim()) return;

    if (credits <= 0) {
        addMessageToChat('Helpr', 'You have no credits left for AI Talk. Please switch to FAQ mode.');
        renderMessages();
        return;
    }

    credits--;
    updateCreditCounter();

    addMessageToChat('You', messageText);

    isTyping = true;
    renderMessages();

    messageInput.value = '';
    sendButton.disabled = true;
    messageInput.disabled = true;

    try {
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: messageText }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        isTyping = false;
        addMessageToChat('Helpr', data.botResponse);
        renderMessages();

    } catch (error) {
        console.error('Error with chatbot API:', error);
        
        isTyping = false;
        addMessageToChat('Helpr', 'Sorry, I am having trouble connecting. Please try again later.');
        renderMessages();
    } finally {
        checkCreditsAndDisableInput();
    }
}

// Function to add a message to the messages array
function addMessageToChat(sender, text) {
    const newMessage = {
        id: Date.now().toString(),
        message: text,
        sender: sender,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwnMessage: sender === 'You',
        avatar: sender === 'Helpr' ? chatbotAvatar : undefined
    };
    messages = [...messages, newMessage];
}

/**
 * Function to initialize the chat after the user agrees.
 */
function initializeChat() {
    legalAgreementContainer.classList.add('hidden');
    chatContainer.classList.remove('hidden');

    switchMode('aiTalk');
    loadConversations();
    renderMessages();
    updateCreditCounter();
}

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
    // Force the theme to be light first, then check for a saved preference
    document.body.classList.remove('dark-mode');
    lightModeIcon.classList.remove('hidden');
    darkModeIcon.classList.add('hidden');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        lightModeIcon.classList.add('hidden');
        darkModeIcon.classList.remove('hidden');
    }
    
    agreeButton.addEventListener('click', initializeChat);
});