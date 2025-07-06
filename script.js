let currentInput = '';
let previousInput = '';
let operator = '';
let shouldResetDisplay = false;

const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');

buttons.forEach(button => {
    button.addEventListener('click', () => handleInput(button.dataset.key));
});

document.addEventListener('keydown', (event) => {
    const keyMap = {
        'Enter': '=',
        'Escape': 'C',
        '/': '/',
        '*': '*',
        '-': '-',
        '+': '+',
        '.': '.',
        '0': '0',
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '6': '6',
        '7': '7',
        '8': '8',
        '9': '9',
        'Backspace': 'Backspace',
        '(': '(',
        ')': ')'
    };
    const key = keyMap[event.key];
    if (key) {
        handleInput(key);
        const button = document.querySelector(`button[data-key="${key}"]`);
        if (button) {
            button.style.transform = 'translateY(2px)';
            button.style.boxShadow = '0 2px 4px var(--shadow-color)';
            setTimeout(() => {
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = '0 4px 8px var(--shadow-color)';
            }, 100);
        }
    }
});

function handleInput(key) {
    if (shouldResetDisplay && !['+', '-', '*', '/', '='].includes(key)) {
        currentInput = '';
        shouldResetDisplay = false;
    }

    switch (key) {
        case 'C':
            resetCalculator();
            break;
        case '=':
            calculate();
            break;
        case 'Backspace':
            currentInput = currentInput.slice(0, -1);
            if (currentInput === '') currentInput = '0';
            break;
        default:
            if (isValidInput(key)) {
                if (currentInput === '0' && key !== '.') {
                    currentInput = key;
                } else {
                    currentInput += key;
                }
            }
            break;
    }
    updateDisplay();
}

function isValidInput(key) {
    if (key === '.' && currentInput.includes('.')) {
        const lastNumber = currentInput.split(/[\+\-\*\/]/).pop();
        if (lastNumber.includes('.')) return false;
    }
    if (['+', '-', '*', '/'].includes(key)) {
        const lastChar = currentInput.slice(-1);
        if (['+', '-', '*', '/'].includes(lastChar)) return false;
    }
    if (currentInput === '' && ['+', '*', '/'].includes(key)) return false;
    return true;
}

function resetCalculator() {
    currentInput = '0';
    previousInput = '';
    operator = '';
    shouldResetDisplay = false;
    updateDisplay();
}

function calculate() {
    try {
        let expression = currentInput.replace(/×/g, '*').replace(/÷/g, '/');
        if (!/^[0-9+\-*/(). ]+$/.test(expression)) {
            throw new Error('Invalid expression');
        }
        let result = eval(expression);
        if (!isFinite(result)) {
            throw new Error('Division by zero');
        }

        result = Math.round(result * 100000000) / 100000000;
        currentInput = result.toString();
        shouldResetDisplay = true;
    } catch (error) {
        currentInput = 'Error';
        shouldResetDisplay = true;
    }
    updateDisplay();
}

function updateDisplay() {
    const fontSize = currentInput.length > 10 ? 1.5 - (currentInput.length - 10) * 0.05 : 2;
    display.style.fontSize = `${fontSize}rem`;
    display.textContent = currentInput || '0';
}
