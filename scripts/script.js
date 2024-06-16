const operators = ['+', '-', '*', '/', '%'];
const divideByZeroErrorMessage = 'Cannot divide by zero';
const screenWidthInDigital = 11;
const MOUSEENTER = 'mouseenter';
const MOUSELEAVE = 'mouseleave';

let buttons = document.querySelector('.buttons');
let display = document.querySelector('.display');
let clear = document.querySelector('.clear');
let operatorButtons = document.querySelectorAll('.operator');
let subDisplay = document.querySelector('.subDisplay');
let mainDisplay = document.querySelector('.mainDisplay');
let equal = document.querySelector('.equal');
let backspaceButton = document.querySelector('.backspace');
let btn0 = document.querySelector('.number0');
let btn1 = document.querySelector('.number1');
let btn2 = document.querySelector('.number2');
let btn3 = document.querySelector('.number3');
let btn4 = document.querySelector('.number4');
let btn5 = document.querySelector('.number5');
let btn6 = document.querySelector('.number6');
let btn7 = document.querySelector('.number7');
let btn8 = document.querySelector('.number8');
let btn9 = document.querySelector('.number9');
let btnAdd = document.querySelector('.add');
let btnSubtract = document.querySelector('.subtract');
let btnMultiply = document.querySelector('.multiply');
let btnDivide = document.querySelector('.divide');
let btnModule = document.querySelector('.module');
let btnDecimal = document.querySelector('.decimal');

let leftNumber;
let rightNumber;
let operator;

equal.addEventListener('click', (e) => {
    if (mainDisplay.textContent === "" || subDisplay.textContent === "") {
        return;
    }

    rightNumber = Number(mainDisplay.textContent);
    let result = operate(leftNumber, rightNumber, operator);

    if (result !== divideByZeroErrorMessage && result.toString().includes('e')) {
        let numberArr = result.toString().split('e');
        let remainLength = screenWidthInDigital - numberArr[1].length - 1;
        result = `${numberArr[0].slice(0, remainLength)}e${numberArr[1]}`;
    }

    if (result !== divideByZeroErrorMessage && result.toString().length > screenWidthInDigital) {
        result = result.toExponential(2);
    }

    clearChildren(mainDisplay, subDisplay);
    mainDisplay.appendChild(document.createTextNode(result));
    if (result === divideByZeroErrorMessage) {
        mainDisplay.style.fontSize = `40px`;
    }
    subDisplay.appendChild(document.createTextNode(`${leftNumber} ${operator} ${rightNumber} =`));
    clearDisplay();
});

buttons.addEventListener('click', (e) => {
    backspaceButton.disabled = false;
    switch(e.target.textContent.trim()) {
        case 'C':
            clearChildren(mainDisplay, subDisplay);
            clearDisplay();
            return;
        case '+/-':
            if (mainDisplay.textContent.includes('-')) {
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
        case '.':
            if (mainDisplay.textContent.includes('.')) {
                return;
            }
            break;
        case 'backspace':
            deleteRightMostMainDisplay();
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

function scientificToDecimal(num) {
    var nsign = Math.sign(num);
    //remove the sign
    num = Math.abs(num);
    //if the number is in scientific notation remove it
    if (/\d+\.?\d*e[\+\-]*\d+/i.test(num)) {
        var zero = '0',
                parts = String(num).toLowerCase().split('e'), //split into coeff and exponent
                e = parts.pop(), //store the exponential part
                l = Math.abs(e), //get the number of zeros
                sign = e / l,
                coeff_array = parts[0].split('.');
        if (sign === -1) {
            l = l - coeff_array[0].length;
            if (l < 0) {
              num = coeff_array[0].slice(0, l) + '.' + coeff_array[0].slice(l) + (coeff_array.length === 2 ? coeff_array[1] : '');
            } 
            else {
              num = zero + '.' + new Array(l + 1).join(zero) + coeff_array.join('');
            }
        } 
        else {
            var dec = coeff_array[1];
            if (dec)
                l = l - dec.length;
            if (l < 0) {
              num = coeff_array[0] + dec.slice(0, l) + '.' + dec.slice(l);
            } else {
              num = coeff_array.join('') + new Array(l + 1).join(zero);
            }
        }
    }

    return nsign < 0 ? '-'+num : num;
};

function deleteRightMostMainDisplay() {
    let mainNumber = Number(mainDisplay.textContent);
    let decimalNumber = scientificToDecimal(mainNumber);
    let newArray = decimalNumber.toString().split('');
    newArray.pop();
    clearChildren(mainDisplay);
    let result = newArray.join('');
    if (result.length > screenWidthInDigital) {
        result = Number(result).toExponential(2);
    }

    mainDisplay.appendChild(document.createTextNode(result));
}

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

    return a / b;
}

function module(a, b) {
    return a % b;
}

window.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'c':
        case 'C':
        case 'Escape':
            clearChildren(mainDisplay, subDisplay);
            clearDisplay();
            clear.classList.add(MOUSEENTER);
            break;
        case '0':
            btn0.click();
            btn0.classList.add(MOUSEENTER);
            break;
        case '1':
            btn1.click();
            btn1.classList.add(MOUSEENTER);
            break;
        case '2':
            btn2.click();
            btn2.classList.add(MOUSEENTER);
            break;
        case '3':
            btn3.click();
            btn3.classList.add(MOUSEENTER);
            break;
        case '4':
            btn4.click();
            btn4.classList.add(MOUSEENTER);
            break;
        case '5':
            btn5.click();
            btn5.classList.add(MOUSEENTER);
            break;
        case '6':
            btn6.click();
            btn6.classList.add(MOUSEENTER);
            break;
        case '7':
            btn7.click();
            btn7.classList.add(MOUSEENTER);
            break;
        case '8':
            btn8.click();
            btn8.classList.add(MOUSEENTER);
            break;
        case '9':
            btn9.click();
            btn9.classList.add(MOUSEENTER);
            break;
        case '+':
            btnAdd.click();
            btnAdd.classList.add(MOUSEENTER);
            break;
        case '-':
            btnSubtract.click();
            btnSubtract.classList.add(MOUSEENTER);
            break;
        case '*':
            btnMultiply.click();
            btnMultiply.classList.add(MOUSEENTER);
            break;
        case '/':
            btnDivide.click();
            btnDivide.classList.add(MOUSEENTER);
            break;
        case '%':
            btnModule.click();
            btnModule.classList.add(MOUSEENTER);
            break;
        case '=':
        case 'Enter':
            equal.click();
            equal.classList.add(MOUSEENTER);
            break;
        case 'Backspace':
            backspaceButton.click();
            backspaceButton.classList.add(MOUSEENTER);
            break;
        case '.':
            btnDecimal.click();
            btnDecimal.classList.add(MOUSEENTER);
            break;
    }
});

window.addEventListener('keyup', (e) => {
    switch(e.key) {
        case 'c':
        case 'C':
        case 'Escape':
            clear.classList.remove(MOUSEENTER);
            break;
        case '0':
            btn0.classList.remove(MOUSEENTER);
            break;
        case '1':
            btn1.classList.remove(MOUSEENTER);
            break;
        case '2':
            btn2.classList.remove(MOUSEENTER);
            break;
        case '3':
            btn3.classList.remove(MOUSEENTER);
            break;
        case '4':
            btn4.classList.remove(MOUSEENTER);
            break;
        case '5':
            btn5.classList.remove(MOUSEENTER);
            break;
        case '6':
            btn6.classList.remove(MOUSEENTER);
            break;
        case '7':
            btn7.classList.remove(MOUSEENTER);
            break;
        case '8':
            btn8.classList.remove(MOUSEENTER);
            break;
        case '9':
            btn9.classList.remove(MOUSEENTER);
            break;
        case '+':
            btnAdd.classList.remove(MOUSEENTER);
            break;
        case '-':
            btnSubtract.classList.remove(MOUSEENTER);
            break;
        case '*':
            btnMultiply.classList.remove(MOUSEENTER);
            break;
        case '/':
            btnDivide.classList.remove(MOUSEENTER);
            break;
        case '%':
            btnModule.classList.remove(MOUSEENTER);
            break;
        case '=':
        case 'Enter':
            equal.classList.remove(MOUSEENTER);
            break;
        case 'Backspace':
            backspaceButton.classList.remove(MOUSEENTER);
            break;
        case '.':
            btnDecimal.classList.remove(MOUSEENTER);
            break;
    }
});

let allButtons = document.querySelectorAll('.buttons button');
allButtons.forEach(btn => btn.addEventListener(MOUSEENTER, (e) => {
    e.target.classList.add(MOUSEENTER);
}));

allButtons.forEach(btn => btn.addEventListener(MOUSELEAVE, (e) => {
    e.target.classList.remove(MOUSEENTER);
}));