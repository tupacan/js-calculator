// calculator functionality

class Calculator {
    constructor(previousOperandTextEl, currentOperandTextEl) {
        this.previousOperandTextEl = previousOperandTextEl;
        this.currentOperandTextEl = currentOperandTextEl;
        this.clear();
    }

    clear() {
        this.currentOperand = "";
        this.previousOperand = "";
        this.operation = undefined;
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    appendNumber(number) {
        // prevent the user to input multiple periods
        if (number === "." && this.currentOperand.includes(".")) return;

        // convert the values to strings, otherwise JS will compute the numbers meaning we can append them
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation) {
        // prevent passing the current operand if it is empty
        if (this.currentOperand === "") return;

        // compute the operation if we have a value in the previous operand
        if (this.previousOperand !== "") {
            this.compute();
        }

        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = "";
    }

    compute() {
        let computation;
        // convert the values to number in order to compute them
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        // prevent hitting the equal button if either previous or current operand is empty
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case "+":
                computation = prev + current;
                break;
            case "-":
                computation = prev - current;
                break;
            case "×":
                computation = prev * current;
                break;
            case "÷":
                computation = prev / current;
                break;
            default:
                return;
        }

        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = "";
    }

    // convert the plain number to a formatted one
    getDisplayNumber(number) {
        const stringNumber = number.toString();

        // split the number into two separate vars - before and after the period
        const integerDigits = parseFloat(stringNumber.split('.')[0])
        const decimalDigits = stringNumber.split('.')[1];

        let integerDisplay;

        // check if the user has initially input a period (decimal place)
        if (isNaN(integerDigits)) {
            integerDisplay = ''
        } else {
            // if not, display a formatted number (evert three digits separated by comma)
            // also prevent the user to input more period signs (decimal places)
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
        }

        // check if the user has input a period and has some numbers after it
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandTextEl.innerText = this.getDisplayNumber(this.currentOperand);

        // add the current operation sign at the end of the previous operand
        if (this.operation != null) {
            this.previousOperandTextEl.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextEl.innerText = '';
        }
    }
}

const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const equalButton = document.querySelector("[data-equal]");
const deleteButton = document.querySelector("[data-delete]");
const allClearButton = document.querySelector("[data-all-clear]");
const previousOperandTextEl = document.querySelector("[data-previous-operand]");
const currentOperandTextEl = document.querySelector("[data-current-operand]");

const calculator = new Calculator(previousOperandTextEl, currentOperandTextEl);

numberButtons.forEach((button) => {
    button.addEventListener("click", () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

operationButtons.forEach((button) => {
    button.addEventListener("click", () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    });
});

equalButton.addEventListener("click", (button) => {
    calculator.compute();
    calculator.updateDisplay();
});

allClearButton.addEventListener("click", (button) => {
    calculator.clear();
    calculator.updateDisplay();
});

deleteButton.addEventListener("click", (button) => {
    calculator.delete();
    calculator.updateDisplay();
});

// light/dark theme toggle functionality

const themeToggler = document.querySelector(".theme-toggle");

themeToggler.addEventListener("click", () => {
    document.body.classList.contains("light-theme") ? enableDarkMode() : enableLightMode();
});

function enableDarkMode() {
    document.body.classList.remove("light-theme");
    document.body.classList.add("dark-theme");
    themeToggler.setAttribute("aria-label", "Switch to light theme");
}

function enableLightMode() {
    document.body.classList.remove("dark-theme");
    document.body.classList.add("light-theme");
    themeToggler.setAttribute("aria-label", "Switch to dark theme");
}

function setThemePreference() {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        enableDarkMode();
        return;
    }

    enableLightMode();
}

document.onload = setThemePreference();
