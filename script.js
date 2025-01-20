document.addEventListener('DOMContentLoaded', () => {
    const calculator = {
        displayValue: '0',
        firstOperand: null,
        waitingForSecondOperand: false,
        operator: null,
    };

    function updateDisplay() {
        const display = document.querySelector('.calculator-screen');
        display.value = calculator.displayValue;
    }

    function inputDigit(digit) {
        const { displayValue, waitingForSecondOperand } = calculator;

        if (waitingForSecondOperand === true) {
            calculator.displayValue = digit;
            calculator.waitingForSecondOperand = false;
        } else {
            calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
        }

        updateDisplay();
    }

    function inputDecimal(dot) {
        if (calculator.waitingForSecondOperand) {
            calculator.displayValue = '0.';
            calculator.waitingForSecondOperand = false;
            return;
        }

        if (!calculator.displayValue.includes(dot)) {
            calculator.displayValue += dot;
        }

        updateDisplay();
    }

    function handleOperator(nextOperator) {
        const { firstOperand, displayValue, operator } = calculator;

        let inputValue = parseFloat(displayValue);

        if (displayValue.includes('sin') || displayValue.includes('cos') || displayValue.includes('tan')) {
            const [func, value] = displayValue.split(' ');
            if(value === "") return;
            inputValue = calculateScientificFunction(value, func);
        } 

        if (operator && calculator.waitingForSecondOperand) {
            calculator.operator = nextOperator;
            return;
        }

        if (firstOperand == null && !isNaN(inputValue)) {
            calculator.firstOperand = inputValue;
            if(operator === 'sin' || operator === 'cos' || operator === 'tan'){
                calculator.displayValue = `${parseFloat(inputValue.toFixed(7))}`;
            }
        } else if (operator) {
            const result = calculate(firstOperand, inputValue, operator);

            calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
            calculator.firstOperand = result;
        }

        calculator.waitingForSecondOperand = true;
        calculator.operator = nextOperator;

        updateDisplay();
    }

    function calculate(firstOperand, secondOperand, operator) {
        if (operator === '+') {
            return firstOperand + secondOperand;
        } else if (operator === '-') {
            return firstOperand - secondOperand;
        } else if (operator === '*') {
            return firstOperand * secondOperand;
        } else if (operator === '/') {
            return firstOperand / secondOperand;
        }

        return secondOperand;
    }

    function calculateScientificFunction(value, operator) {
        const valueInRadians = parseFloat(value) * (Math.PI / 180);
        if (operator === 'sin') {
            return Math.sin(valueInRadians);
        } else if (operator === 'cos') {
            return Math.cos(valueInRadians);
        } else if (operator === 'tan') {
            return Math.tan(valueInRadians);
        }
    }

    function handleScientificFunction(func) {
        const { displayValue, waitingForSecondOperand } = calculator;
    
        if (waitingForSecondOperand || displayValue === '0') {
            calculator.displayValue = func + ' ';
            calculator.waitingForSecondOperand = false;
        } else {
            return;
        }
    
        calculator.operator = func;
        updateDisplay();
    }

    function resetCalculator() {
        calculator.displayValue = '0';
        calculator.firstOperand = null;
        calculator.waitingForSecondOperand = false;
        calculator.operator = null;
        updateDisplay();
    }

    const keys = document.querySelector('.calculator-keys');
    keys.addEventListener('click', (event) => {
        const { target } = event;
        const { value } = target;

        if (!target.matches('button')) {
            return;
        }

        switch (value) {
            case '+':
            case '-':
            case '*':
            case '/':
            case '=':
                handleOperator(value);
                break;
            case 'sin':
            case 'cos':
            case 'tan':
                handleScientificFunction(value);
                break;
            case '.':
                inputDecimal(value);
                break;
            case 'all-clear':
                resetCalculator();
                break;
            default:
                if (Number.isInteger(parseFloat(value))) {
                    inputDigit(value);
                }
        }
    });

    updateDisplay();
});