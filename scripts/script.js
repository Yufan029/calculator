const operators = ['+', '-', '*', '/', '%'];
const divideByZeroErrorMessage = 'Cannot divide by zero';
const screenWidthInDigital = 11;
const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

let buttons = document.querySelector('.buttons');
let display = document.querySelector('.display');
let clear = document.querySelector('.clear');
let operatorButtons = document.querySelectorAll('.operator');
let subDisplay = document.querySelector('.subDisplay');
let mainDisplay = document.querySelector('.mainDisplay');
let equal = document.querySelector('.equal');

let leftNumber;
let rightNumber;
let operator;

equal.addEventListener('click', (e) => {
    if (mainDisplay.textContent === "") {
        return;
    }

    rightNumber = Number(mainDisplay.textContent);
    let result = operate(leftNumber, rightNumber, operator);
    clearChildren(mainDisplay, subDisplay);
    mainDisplay.appendChild(document.createTextNode(result));
    if (result === divideByZeroErrorMessage) {
        mainDisplay.style.fontSize = `40px`;
    }
    subDisplay.appendChild(document.createTextNode(`${leftNumber} ${operator} ${rightNumber} =`));
    clearDisplay();
});

buttons.addEventListener('click', (e) => {
    switch(e.target.textContent) {
        case 'C':
            clearChildren(mainDisplay, subDisplay);
            clearDisplay();
            return;
        case '+/-':
            if (mainDisplay.textContent.includes('-')) {
                //mainDisplay.removeChild(mainDisplay.firstChild);
                let text = mainDisplay.textContent.toString();
                let newText = text.slice(text.indexOf('-')+1);
                clearChildren(mainDisplay);
                mainDisplay.appendChild(document.createTextNode(newText));
            } else {
                mainDisplay.insertBefore(document.createTextNode('-'), mainDisplay.firstChild);
            }
            
            return;
        case '=':
            return;
    }

    if (operators.includes(e.target.textContent)) {
        operator = e.target.textContent;
        return;
    }

    if (mainDisplay.childNodes.length > screenWidthInDigital ||
        e.target.textContent.length > 1) {
        return;
    }

    if (subDisplay.textContent.includes('=')) {
        clearChildren(mainDisplay, subDisplay);
        clearDisplay();
    }

    mainDisplay.appendChild(document.createTextNode(e.target.textContent));
    e.preventDefault();
});

operatorButtons.forEach(x => {
    x.addEventListener('click', (e) => {
        if (mainDisplay.textContent === "") {
            return;
        } else if (subDisplay.textContent !== "" && !subDisplay.textContent.includes('=')) {
            rightNumber = Number(mainDisplay.textContent);
            equal.click();
        }

        leftNumber = Number(mainDisplay.textContent);
        clearChildren(mainDisplay, subDisplay);
        operator = e.target.textContent;
        subDisplay.appendChild(document.createTextNode(`${leftNumber}${operator}`));
    });
});

function clearChildren(...elements) {
    for (let element of elements) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }
}

function clearDisplay() {
    leftNumber = null;
    operator = null;
    rightNumber == null;
}

function operate(leftNumber, rightNumber, operator) {
    switch (operator) {
        case '+':
            return add(leftNumber, rightNumber);

        case '-':
            return subtract(leftNumber, rightNumber);

        case '*':
            return multiply(leftNumber, rightNumber);

        case '/':
            return divide(leftNumber, rightNumber);

        case '%':
            return module(leftNumber, rightNumber);
    }
}

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        return 'Cannot divide by zero';
    }

    let result = a / b;
    let arr = result.toString().split('.');
    if (arr[0].length + arr[1].length > screenWidthInDigital) {
        result = `${arr[0]}.${arr[1].slice(0, 10-arr[0].length)}`;
    }

    return Number(result);
}

function module(a, b) {
    return a % b;
}