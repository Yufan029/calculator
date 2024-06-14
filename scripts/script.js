let buttons = document.querySelector('.buttons');
let display = document.querySelector('.display');
let clear = document.querySelector('.clear');

buttons.addEventListener('click', (e) => {
    let text = document.createTextNode(e.target.textContent);
    if (e.target.textContent === 'AC') {
        return;
    }

    if (display.childNodes.length > 11) {
        return;
    }

    display.appendChild(text);
});

clear.addEventListener('click', () => {
    while (display.firstChild) {
        display.removeChild(display.firstChild);
    }
});