// DOM Elements
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;
const passwordInput = document.getElementById('passwordInput');
const generatedPassword = document.getElementById('generatedPassword');
const lengthSlider = document.getElementById('lengthSlider');
const lengthValue = document.getElementById('lengthValue');
const strengthIndicator = document.getElementById('strengthIndicator');
const strengthMessage = document.getElementById('strengthMessage');
const eyeIcon = document.getElementById('eyeIcon');

// Password Generation Settings
const wordList = [
    'apple', 'banana', 'carrot', 'dog', 'elephant', 'fish', 'green', 'house',
    'ice', 'jungle', 'king', 'lemon', 'mountain', 'nest', 'orange', 'purple',
    'queen', 'river', 'snake', 'tree', 'umbrella', 'violet', 'water', 'xylophone',
    'yellow', 'zebra', 'air', 'book', 'cat', 'door', 'earth', 'fire', 'grass', 'hat',
    'island', 'jacket', 'kite', 'lake', 'mouse', 'note', 'ocean', 'piano', 'quilt',
    'rose', 'sun', 'train', 'unicorn', 'volcano', 'window', 'xenon', 'yacht', 'zeppelin'
];

// Initialize dark mode
if (localStorage.getItem('darkMode') === 'enabled') {
    enableDarkMode();
}

// Dark mode toggle
darkModeToggle.addEventListener('click', () => {
    body.classList.contains('dark-mode') ? disableDarkMode() : enableDarkMode();
});

function enableDarkMode() {
    body.classList.add('dark-mode');
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    localStorage.setItem('darkMode', 'enabled');
}

function disableDarkMode() {
    body.classList.remove('dark-mode');
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    localStorage.setItem('darkMode', 'disabled');
}

// Password strength checker
passwordInput.addEventListener('input', function() {
    const password = this.value;
    const { strengthLevel, feedback } = analyzePasswordStrength(password);
    
    strengthIndicator.className = 'strength-level';
    strengthIndicator.classList.add(strengthLevel);
    strengthMessage.textContent = feedback;
});

function analyzePasswordStrength(password) {
    if (!password) return { strengthLevel: '', feedback: '' };
    
    let score = 0;
    const length = password.length;
    
    // Length score
    if (length >= 16) score += 4;
    else if (length >= 12) score += 3;
    else if (length >= 8) score += 2;
    else if (length >= 4) score += 1;
    
    // Character variety
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[\W_]/.test(password);
    
    const varietyCount = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;
    score += varietyCount * 2;
    
    // Deductions for poor patterns
    if (/(.)\1{2,}/.test(password)) score -= 2; // Repeated characters
    if (/123|abc|qwerty|password|admin|welcome/i.test(password)) score -= 3; // Common sequences
    if (password === password.toLowerCase() || password === password.toUpperCase()) score -= 1; // All same case
    
    // Bonus for good patterns
    if (hasLower && hasUpper) score += 1;
    if ((hasNumber || hasSymbol) && (hasLower || hasUpper)) score += 1;
    if (length >= 12 && varietyCount >= 3) score += 2;
    
    // Cap score between 0 and 10
    score = Math.max(0, Math.min(score, 10));
    
    // Determine strength level
    if (score <= 3) {
        return { 
            strengthLevel: 'weak',
            feedback: 'Weak password - easily guessable'
        };
    } else if (score <= 6) {
        return { 
            strengthLevel: 'medium',
            feedback: 'Medium password - could be stronger'
        };
    } else if (score <= 8) {
        return { 
            strengthLevel: 'strong',
            feedback: 'Strong password - good job!'
        };
    } else {
        return { 
            strengthLevel: 'very-strong',
            feedback: 'Very strong password - excellent!'
        };
    }
}

// Password generation functions
function generateCharacterPassword() {
    const length = parseInt(lengthSlider.value);
    const useUppercase = document.getElementById('uppercase').checked;
    const useNumbers = document.getElementById('numbers').checked;
    const useSymbols = document.getElementById('symbols').checked;
    
    const charSets = {
        lower: 'abcdefghijklmnopqrstuvwxyz',
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };
    
    let chars = charSets.lower;
    if (useUppercase) chars += charSets.upper;
    if (useNumbers) chars += charSets.numbers;
    if (useSymbols) chars += charSets.symbols;
    
    let password = '';
    const selectedSets = [];
    
    if (useUppercase) selectedSets.push(charSets.upper);
    if (useNumbers) selectedSets.push(charSets.numbers);
    if (useSymbols) selectedSets.push(charSets.symbols);
    
    selectedSets.forEach(set => {
        password += set.charAt(Math.floor(Math.random() * set.length));
    });
    
    for (let i = password.length; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    password = password.split('').sort(() => 0.5 - Math.random()).join('');
    return password;
}

function generateWordPassword() {
    const wordCount = parseInt(document.getElementById('wordCount').value);
    const useUppercase = document.getElementById('uppercase').checked;
    const useNumbers = document.getElementById('numbers').checked;
    const useSymbols = document.getElementById('symbols').checked;

    let words = [];
    for (let i = 0; i < wordCount; i++) {
        const word = wordList[Math.floor(Math.random() * wordList.length)];
        words.push(useUppercase ? word.charAt(0).toUpperCase() + word.slice(1) : word);
    }

    let password = words.join('');

    if (useNumbers) password += Math.floor(Math.random() * 10);
    if (useSymbols) {
        const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        password += symbols[Math.floor(Math.random() * symbols.length)];
    }

    return password;
}

// Main password generation handler
function generatePassword() {
    const isWordMode = document.getElementById('randomWords').checked;
    generatedPassword.value = isWordMode ? generateWordPassword() : generateCharacterPassword();
    
    // Analyze the generated password
    const { strengthLevel, feedback } = analyzePasswordStrength(generatedPassword.value);
    strengthIndicator.className = 'strength-level';
    strengthIndicator.classList.add(strengthLevel);
    strengthMessage.textContent = feedback;
}

// Update length display
function updateLength() {
    lengthValue.textContent = lengthSlider.value;
}

// Toggle password visibility
function togglePassword() {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.className = 'far fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        eyeIcon.className = 'far fa-eye';
    }
}

// Copy to clipboard
function copyToClipboard() {
    generatedPassword.select();
    document.execCommand('copy');
    
    const notification = document.createElement('div');
    notification.textContent = 'Password copied!';
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: var(--primary);
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        font-size: 14px;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Password type toggle
document.getElementById('randomCharacters').addEventListener('change', togglePasswordType);
document.getElementById('randomWords').addEventListener('change', togglePasswordType);

function togglePasswordType() {
    const isWordMode = document.getElementById('randomWords').checked;
    document.getElementById('lengthOptions').style.display = isWordMode ? 'none' : 'block';
    document.getElementById('wordOptions').style.display = isWordMode ? 'block' : 'none';
}

// Create animated particles
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.body.appendChild(particlesContainer);
    
    const particleCount = window.innerWidth < 768 ? 30 : 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 5 + 2;
        const posX = Math.random() * window.innerWidth;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 10;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}px`;
        particle.style.top = `${window.innerHeight + size}px`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        particlesContainer.appendChild(particle);
    }
}

// Initialize
updateLength();
generatePassword();
createParticles();

// Handle window resize
window.addEventListener('resize', () => {
    document.querySelector('.particles')?.remove();
    createParticles();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px) translateX(-50%); }
        to { opacity: 1; transform: translateY(0) translateX(-50%); }
    }
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0) translateX(-50%); }
        to { opacity: 0; transform: translateY(-10px) translateX(-50%); }
    }
`;
document.head.appendChild(style);

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        generatedPassword.style.width = 'calc(100% - 88px)';
    }, 250);
});