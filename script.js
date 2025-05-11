document.addEventListener('DOMContentLoaded', () => {
    // Initialize app
    initializeDarkMode();
    setupEventListeners();
    generatePassword();
    createParticles();
});

// Modern Clipboard API
const copyToClipboard = async () => {
    try {
        await navigator.clipboard.writeText(generatedPassword.value);
        showNotification('Password copied to clipboard!');
    } catch (err) {
        showNotification('Failed to copy!', true);
    }
};

// Enhanced password generator
const generatePassword = () => {
    const config = {
        length: parseInt(lengthSlider.value),
        useUppercase: uppercase.checked,
        useNumbers: numbers.checked,
        useSymbols: symbols.checked,
        avoidAmbiguous: avoidAmbiguous.checked
    };

    const password = createPassword(config);
    generatedPassword.value = password;
    updatePasswordStrength(password);
    addToHistory(password);
};

const createPassword = ({ length, ...options }) => {
    const charSets = {
        lower: 'abcdefghjkmnpqrstuvwxyz', // Avoid ambiguous
        upper: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
        numbers: '23456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    if (!options.avoidAmbiguous) {
        charSets.lower += 'ilo';
        charSets.upper += 'IO';
        charSets.numbers += '01';
    }

    let chars = charSets.lower;
    if (options.useUppercase) chars += charSets.upper;
    if (options.useNumbers) chars += charSets.numbers;
    if (options.useSymbols) chars += charSets.symbols;

    return Array.from(crypto.getRandomValues(new Uint32Array(length)))
        .map(x => chars[x % chars.length])
        .join('');
};

// Password history feature
const passwordHistory = JSON.parse(localStorage.getItem('passwordHistory') || '[]');

const addToHistory = (password) => {
    passwordHistory.unshift(password);
    if (passwordHistory.length > 5) passwordHistory.pop();
    localStorage.setItem('passwordHistory', JSON.stringify(passwordHistory));
    updateHistoryDisplay();
};

const updateHistoryDisplay = () => {
    historyList.innerHTML = passwordHistory
        .map(pw => `<li>${pw}</li>`)
        .join('');
};

// Modern event listeners
const setupEventListeners = () => {
    darkModeToggle.addEventListener('click', toggleDarkMode);
    document.querySelector('.copy-btn').addEventListener('click', copyToClipboard);
    document.querySelector('.refresh-btn').addEventListener('click', generatePassword);
    document.querySelector('.generate-btn').addEventListener('click', generatePassword);
    lengthSlider.addEventListener('input', updateLengthDisplay);
    passwordInput.addEventListener('input', analyzePasswordStrength);
    document.querySelector('.eye-btn').addEventListener('click', togglePasswordVisibility);
};

// Rest of your functions with error handling and optimizations