const fs = require('fs');
const path = require('path');

// List of HTML files to update
const htmlFiles = [
    'index.html',
    'dashboard.html',
    'map.html',
    'security.html',
    'profile.html',
    'billing.html',
    'forecast.html',
    'login.html',
    'signup.html',
    'mybooking.html',
    'live ai booking.html',
    'report.html'
];

// Function to add chatbot resources to HTML files
function addChatbotResources(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Add CSS link if not present
    if (!content.includes('chatbot.css')) {
        content = content.replace('</head>', '    <link rel="stylesheet" href="css/chatbot.css">\n</head>');
    }

    // Add JS script if not present
    if (!content.includes('chatbot.js')) {
        content = content.replace('</body>', '    <script src="js/chatbot.js"></script>\n</body>');
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
}

// Process all HTML files
htmlFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
        addChatbotResources(filePath);
    } else {
        console.log(`File not found: ${file}`);
    }
});