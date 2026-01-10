(function () {
    // Configuration
    const API_BASE_URL = 'http://localhost:3000/api'; // In production, this would be dynamic

    // Find script tag to get slug
    const currentScript = document.currentScript || (function () {
        var scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();

    const businessSlug = currentScript.getAttribute('data-slug');

    if (!businessSlug) {
        console.error('ChatWidget: data-slug attribute is missing.');
        return;
    }

    // Styles
    const styles = `
        #pam-chat-widget-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 99999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        
        #pam-chat-button {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: #2563eb;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s;
        }
        
        #pam-chat-button:hover {
            transform: scale(1.05);
        }
        
        #pam-chat-icon {
            width: 30px;
            height: 30px;
            fill: white;
        }
        
        #pam-chat-window {
            display: none;
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            flex-direction: column;
            overflow: hidden;
            border: 1px solid #e5e7eb;
        }
        
        #pam-chat-header {
            background: #2563eb;
            color: white;
            padding: 16px;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        #pam-chat-messages {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            background: #f9fafb;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .pam-message {
            max-width: 80%;
            padding: 10px 14px;
            border-radius: 12px;
            font-size: 14px;
            line-height: 1.4;
        }
        
        .pam-message-user {
            background: #2563eb;
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 4px;
        }
        
        .pam-message-ai {
            background: white;
            color: #1f2937;
            align-self: flex-start;
            border-bottom-left-radius: 4px;
            border: 1px solid #e5e7eb;
        }
        
        #pam-chat-input-area {
            padding: 16px;
            border-top: 1px solid #e5e7eb;
            background: white;
            display: flex;
            gap: 8px;
        }
        
        #pam-chat-input {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 20px;
            outline: none;
            font-size: 14px;
        }
        
        #pam-chat-input:focus {
            border-color: #2563eb;
        }
        
        #pam-chat-send {
            background: #2563eb;
            color: white;
            border: none;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        #pam-chat-send:disabled {
            background: #9ca3af;
            cursor: not-allowed;
        }

        /* Loading Dots */
        .typing-indicator {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 12px;
        }
        .dot {
            width: 6px;
            height: 6px;
            background: #6b7280;
            border-radius: 50%;
            animation: bounce 1.4s infinite ease-in-out both;
        }
        .dot:nth-child(1) { animation-delay: -0.32s; }
        .dot:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }
    `;

    // Inject Styles
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Create UI Elements
    const container = document.createElement('div');
    container.id = 'pam-chat-widget-container';

    container.innerHTML = `
        <div id="pam-chat-window">
            <div id="pam-chat-header">
                <span>Business Assistant</span>
                <span style="cursor:pointer; font-size: 20px;" id="pam-close-btn">&times;</span>
            </div>
            <div id="pam-chat-messages">
                <div class="pam-message pam-message-ai">
                    Hello! How can I help you today?
                </div>
            </div>
            <form id="pam-chat-input-area">
                <input type="text" id="pam-chat-input" placeholder="Type a message..." autocomplete="off" />
                <button type="submit" id="pam-chat-send">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </form>
        </div>
        <div id="pam-chat-button">
            <svg id="pam-chat-icon" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
        </div>
    `;

    document.body.appendChild(container);

    // Elements
    const button = document.getElementById('pam-chat-button');
    const window = document.getElementById('pam-chat-window');
    const closeBtn = document.getElementById('pam-close-btn');
    const form = document.getElementById('pam-chat-input-area');
    const input = document.getElementById('pam-chat-input');
    const messages = document.getElementById('pam-chat-messages');
    const sendBtn = document.getElementById('pam-chat-send');

    // State
    let isOpen = false;
    let isTyping = false;

    // Functions
    function toggleChat() {
        isOpen = !isOpen;
        window.style.display = isOpen ? 'flex' : 'none';
        if (isOpen) input.focus();
    }

    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `pam-message pam-message-${sender}`;
        div.textContent = text;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    function addTypingIndicator() {
        const div = document.createElement('div');
        div.className = 'pam-message pam-message-ai typing-indicator';
        div.id = 'pam-typing';
        div.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    function removeTypingIndicator() {
        const el = document.getElementById('pam-typing');
        if (el) el.remove();
    }

    async function sendMessage(text) {
        addMessage(text, 'user');
        input.value = '';
        isTyping = true;
        sendBtn.disabled = true;
        addTypingIndicator();

        try {
            const response = await fetch(`${API_BASE_URL}/chat/public/${businessSlug}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question: text })
            });

            const data = await response.json();
            removeTypingIndicator();

            if (data.success) {
                addMessage(data.answer, 'ai');
            } else {
                addMessage('Sorry, I encountered an error. Please try again.', 'ai');
            }
        } catch (error) {
            removeTypingIndicator();
            addMessage('Network error. Please check your connection.', 'ai');
        } finally {
            isTyping = false;
            sendBtn.disabled = false;
        }
    }

    // Event Listeners
    button.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (text && !isTyping) {
            sendMessage(text);
        }
    });

})();
