// Chatbot functionality
class Chatbot {
    constructor() {
        this.responses = {
            'parking': 'Our smart parking system uses AI to help you find and book parking spots easily. You can check availability in real-time and make reservations through our booking system.',
            'payment': 'We accept various payment methods including credit/debit cards, digital wallets, and UPI. All payments are processed securely through our payment gateway.',
            'security': 'We have 24/7 CCTV surveillance, security personnel, and AI-powered monitoring systems to ensure the safety of your vehicle.',
            'booking': 'To book a parking slot, navigate to the "Live AI Booking" section from the dashboard. You can select your preferred time slot and location.',
            'cancellation': 'You can cancel your booking up to 2 hours before the scheduled time for a full refund. Cancellations can be made from the "My Bookings" section.',
            'hours': 'Our parking facilities are available 24/7. You can book slots for any time of the day.',
            'contact': 'For immediate assistance, please call our helpline at +1-800-PARK-SMART or email us at support@smartparking.com',
            'rates': 'Our parking rates vary based on location and duration. Basic rates start from $2/hour. Premium locations may have different pricing.',
            'membership': 'We offer different membership plans: Basic, Standard, and Premium. Each plan comes with unique benefits like discounted rates and priority booking.',
            'help': 'I can help you with parking information, bookings, payments, security, and general inquiries. What would you like to know about?',
            'profile': 'Loading...'
        };
        this.init();
        this.loadUserProfile();
    }

    init() {
        // Create chatbot HTML structure
        const chatbotHTML = `
            <div class="chatbot-container">
                <button class="chat-toggle-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                    </svg>
                </button>
                <div class="chat-window">
                    <div class="chat-header">
                        <h3>Smart Parking Assistant</h3>
                        <button class="close-chat">&times;</button>
                    </div>
                    <div class="chat-messages">
                        <div class="message bot-message">
                            Hello! I'm your Smart Parking Assistant. How can I help you today?
                        </div>
                    </div>
                    <div class="chat-input">
                        <input type="text" placeholder="Type your message here..." />
                        <button class="send-btn">Send</button>
                    </div>
                </div>
            </div>
        `;

        // Add chatbot to the page
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);

        // Initialize elements
        this.toggleBtn = document.querySelector('.chat-toggle-btn');
        this.chatWindow = document.querySelector('.chat-window');
        this.closeBtn = document.querySelector('.close-chat');
        this.messagesContainer = document.querySelector('.chat-messages');
        this.input = document.querySelector('.chat-input input');
        this.sendBtn = document.querySelector('.send-btn');

        // Add event listeners
        this.toggleBtn.addEventListener('click', () => this.toggleChat());
        this.closeBtn.addEventListener('click', () => this.toggleChat());
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    toggleChat() {
        this.chatWindow.classList.toggle('active');
        if (this.chatWindow.classList.contains('active')) {
            this.input.focus();
        }
    }

    sendMessage() {
        const message = this.input.value.trim();
        if (message === '') return;

        // Add user message
        this.addMessage(message, 'user');
        this.input.value = '';

        // Generate and add bot response
        const response = this.generateResponse(message);
        setTimeout(() => {
            this.addMessage(response, 'bot');
        }, 500);
    }

    addMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${type}-message`);
        messageDiv.textContent = message;
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    generateResponse(message) {
        message = message.toLowerCase();
        
        // Check for profile request
        if (message.includes('profile') || message.includes('my details') || message.includes('my information')) {
            return this.responses['profile'];
        }

        // Check for keywords in the message
        for (const [keyword, response] of Object.entries(this.responses)) {
            if (message.includes(keyword)) {
                return response;
            }
        }

        // Default response if no keyword matches
        return "I can help you with parking information, bookings, payments, security, and general inquiries. Could you please rephrase your question or specify what you'd like to know about?";
    }

    async loadUserProfile() {
        try {
            const response = await fetch('get_user_data.php');
            const data = await response.json();
            
            if (data.status === 'success') {
                this.responses['profile'] = `Here are your registration details:\n\nName: ${data.firstName}\nMembership Plan: ${data.plan || 'Basic'}\nJoined: ${data.joinDate}\n`;
            } else {
                this.responses['profile'] = data.message || 'Unable to load your profile information. Please try again later.';
            }
        } catch (error) {
            this.responses['profile'] = 'Unable to load your profile information. Please try again later.';
            console.error('Error loading user profile:', error);
        }
    }
}

// Initialize chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
});