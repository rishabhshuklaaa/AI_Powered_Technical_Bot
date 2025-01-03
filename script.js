function sendMessage() {
    const userMessage = document.getElementById('user-message').value;
    if (userMessage.trim() === '') return;

    // Clear the input field
    document.getElementById('user-message').value = '';

    // Display the user's message in the chat window
    const chatWindow = document.getElementById('chat-window');
    const userMessageElement = document.createElement('div');
    userMessageElement.className = 'chat-message-wrapper user';
    userMessageElement.innerHTML = `
        <div class="chat-message">${userMessage}</div>
        <img src="https://img.freepik.com/premium-vector/avatar-icon0002_750950-43.jpg" class="chat-avatar" alt="User">
    `;
    chatWindow.appendChild(userMessageElement);

    // Send a POST request to the server with the user message
    fetch('http://192.168.1.3:8000/support', {  // Replace with your backend URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: 'Rishabh123', // Replace with a unique user ID
            user_details: { user_id: 'Rishabh123' }, // Replace with appropriate user details
            user_message: userMessage
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Get the bot's response and format it
        const botResponse = data.response || data.error || 'No response';
        const formattedResponse = formatResponse(botResponse);

        // Display the bot's response
        const botMessageElement = document.createElement('div');
        botMessageElement.className = 'chat-message-wrapper bot';
        botMessageElement.innerHTML = `
            <div class="chat-message">${formattedResponse}</div>
            <img src="https://i.ibb.co/fSNP7Rz/icons8-chatgpt-512.png" class="chat-avatar" alt="Bot">
        `;
        chatWindow.appendChild(botMessageElement);
        scrollToBottom();
    })
    .catch(error => {
        const botMessageElement = document.createElement('div');
        botMessageElement.className = 'chat-message-wrapper bot';
        botMessageElement.textContent = 'Error: Unable to reach the server.';
        chatWindow.appendChild(botMessageElement);
        console.error('Error:', error);
        scrollToBottom();
    });
}

function scrollToBottom() {
    const chatWindow = document.getElementById('chat-window');
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function formatResponse(text) {
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/### (.*)/g, '<h1>$1</h1>');
    const paragraphs = text.split('\n\n');
    let html = '';
    paragraphs.forEach(paragraph => {
        if (paragraph.includes('\n-')) {
            const [intro, ...points] = paragraph.split('\n');
            html += `<p>${intro}</p>`;
            const listItems = points
                .filter(point => point.trim())
                .map(point => `<li>${point.replace(/^-\s*/, '')}</li>`)
                .join('');
                
            html += `<ul>${listItems}</ul>`;
        } else {
            html += `<p>${paragraph.replace(/\n/g, '<br>')}</p>`;
        }
    });
    return html;
}
