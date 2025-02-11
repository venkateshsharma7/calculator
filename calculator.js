// calculator.js

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('button');
    
    let currentInput = '';      // Stores current input string
    let firstOperand = null;    // Stores first operand for operations
    let currentOperator = null; // Stores active operator
    let resetDisplay = false;   // Flag to reset display after operator

    // Update calculator display
    function updateDisplay() {
        if (currentInput === '') {
            display.textContent = '0';
        } else {
            display.textContent = currentInput.slice(0, 15); // Limit to 15 characters
        }
    }

    // Handle number input (including 00 and 0)
    function handleNumber(number) {
        if (resetDisplay) {
            currentInput = '';
            resetDisplay = false;
        }
        
        // Prevent multiple leading zeros except for decimal numbers
        if (number === '00' && currentInput === '0') return;
        if (number === '0' && currentInput === '0') return;
        
        currentInput += number;
        updateDisplay();
    }

    // Handle decimal point
    function handleDecimal() {
        if (resetDisplay) {
            currentInput = '0.';
            resetDisplay = false;
            updateDisplay();
            return;
        }
        
        if (!currentInput.includes('.')) {
            currentInput += currentInput === '' ? '0.' : '.';
            updateDisplay();
        }
    }

    // Handle operator buttons
    function handleOperator(operator) {
        const inputValue = parseFloat(currentInput);
        
        if (firstOperand === null) {
            firstOperand = inputValue;
        } else if (currentOperator) {
            const result = calculate();
            firstOperand = result;
            currentInput = String(result);
            updateDisplay();
        }
        
        currentOperator = operator;
        resetDisplay = true;
    }

    // Perform calculations
    function calculate() {
        if (firstOperand === null || !currentOperator) return;
        
        const secondOperand = parseFloat(currentInput);
        let result;
        
        switch (currentOperator) {
            case '+':
                result = firstOperand + secondOperand;
                break;
            case '-':
                result = firstOperand - secondOperand;
                break;
            case '*':
                result = firstOperand * secondOperand;
                break;
            case '/':
                result = secondOperand === 0 ? NaN : firstOperand / secondOperand;
                break;
            case '%':
                result = firstOperand % secondOperand;
                break;
        }

        // Handle calculation errors
        if (isNaN(result) || !isFinite(result)) {
            clearCalculator();
            display.textContent = 'Error';
            return;
        }
        
        currentInput = String(result);
        firstOperand = null;
        currentOperator = null;
        updateDisplay();
        return result;
    }

    // Clear calculator state
    function clearCalculator() {
        currentInput = '';
        firstOperand = null;
        currentOperator = null;
        resetDisplay = false;
        updateDisplay();
    }

    // Handle backspace
    function handleBackspace() {
        currentInput = currentInput.slice(0, -1);
        if (currentInput === '') currentInput = '0';
        updateDisplay();
    }

    // Button click handler
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;

            switch (true) {
                case button.id === 'clear':
                    clearCalculator();
                    break;
                    
                case button.id === 'backspace':
                    handleBackspace();
                    break;
                    
                case button.id === 'equal':
                    calculate();
                    break;
                    
                case ['add', 'subtract', 'multiply', 'divide', 'modulo'].includes(button.id):
                    handleOperator(value);
                    break;
                    
                case button.id === 'decimal':
                    handleDecimal();
                    break;
                    
                case !!value.match(/[0-9]/): // Number buttons (including 00)
                    handleNumber(value);
                    break;
            }
        });
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        const key = e.key;
        
        if (key >= '0' && key <= '9') handleNumber(key);
        if (key === '.') handleDecimal();
        if (['+', '-', '*', '/', '%'].includes(key)) handleOperator(key);
        if (key === 'Enter' || key === '=') calculate();
        if (key === 'Backspace') handleBackspace();
        if (key === 'Escape') clearCalculator();
        
        // Prevent default behavior for operator keys
        if (['+', '-', '*', '/', '%'].includes(key)) e.preventDefault();
    });
});