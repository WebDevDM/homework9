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

updateDisplay;

//Set the contant "keys" to .calulator keys
const keys = document.querySelector('.calculator-keys');
//when someone clicks on one of the "keys (i.e. something with the .calculator-keys class"), then addEventListener will detect that with the below.
keys.addEventListener('click', (event) => {
//An event is triggered and a constant is created = to that event.
//A "target" variable is an object which represents the element that was clicked in the event.
    const { target } = event;
//This now checks if the click was on a button. If not, it exits the function.
    if (!target.matches('button')) {
        return;
    }

//This will check to see if the click was on an operator, because it will be able to detect it has the ".operator class".
    if (target.classList.contains('operator')) {
        //If it's an operator, then the value of that operator (i.e. the target) will be logged in the console.
        //console.log('operator', target.value);
        //We've replaced the above with the below so that the target is used in the "handleOperator" function below, and so that it updates the display of the calculator:
        handleOperator(target.value);
        updateDisplay();
        return;
    }
//The below "if" statements do the same, but cover the decimal and AC classes.    
    if (target.classList.contains('decimal')) {
        //console.log('decimal', target.value);
        //We've replaced the above with the below so that the target is used in the "inputDecimal" function below, and so that it updates the display of the calculator:
        inputDecimal(target.value);
        updateDisplay();
        return;
    }

    if (target.classList.contains('all-clear')) {
        //console.log('clear', target.value);
        //! We replaced the above with the below, so that instead of loggin clear in the console when the AC key is clicked, it instead runs the resetCalculator function and updates the display:
        resetCalculator();
        updateDisplay();
        return;
    }
    //If it was a digit that was clicked, then that's logged in the console.
    //console.log('digit', target.value);

    //We've replaced the above with the below so that the target is used in the "inputDigit" function below, and so that it updates the display of the calculator:
    inputDigit(target.value);
    updateDisplay();
    });
//This whole section can basically be used to see if when we press the buttons on the calculator, that the console can detect the correct input for the function. So on testing, it says "digit 7" if we pressed the 7 key, or "operator =" if we pressed the equals key, or "decimal ." if we pressed the decimal key, or "clear all-clear" if we pressed the AC key. It's a good check to do.


//Now we want to get those values to display on the "screen" of the calculator instead of in the console.
//Before, we made it so that the "displayValue" property of the object "calculator" represnts whatver the user has input. So that's what will need to be modified when any of the digits are clicked.

//We set the function parameters to "digit" so that it only works with digits.
function inputDigit(digit) {
    //We set displayValue to be equal to calculator:
    //We also added waitingForSecondOperand so that we can set it to true when a digit is clicked after a firstOperand and an operator.
    const { displayValue, waitingForSecondOperand } = calculator;
    //This checks to see if the if the waitingForSecondOperand property is set to true, the displayValue property is overwritten with the digit that was clicked:
    if (waitingForSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    }
    //Otherwise, if the waitingForSecondOperand property is NOT set to true; then we override `displayValue` if the current value of calculator is '0', otherwise we append the digit to the end of it:
    else{
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit
    }
    console.log(calculator)
}
//We've overwritten the below with the above.    
// `displayValue` is overwritten if the current value of calculator is '0', otherwise we append the digit to the end of it:
//    calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
//    console.log(calculator);
//  }

//Now we want to make it so that when the decimal key is clicked, that a decimal point is appended to the end of our displayValue:
function inputDecimal(dot) {
    //The below line checks to see if the displayValue does not already contain a decimal point.
    //if (!calculator.displayValue.includes(dot)){
        //! We've replaced the above with the below so that the function checks to see if we are waiting for a second operator. Then if that is true, the displayValue is set to 0 and waitingForSecondOperand is set to false so that we can add numbers after the decimal point:
        if (calculator.waitingForSecondOperand === true) {
            calculator.displayValue = '0.'
            calculator.waitingForSecondOperand = false;
          return
        }
        //If it doesn't, the below line appends a decimal point:
        calculator.displayValue += dot;
    }


//Now we want to get the operators working, and there are 3 scenarios to account for (+, -, *, /, =)

function handleOperator(nextOperator) {
    // Destructure the properties on the calculator object
    const { firstOperand, displayValue, operator } = calculator
    // `parseFloat` converts the string contents of `displayValue`
    // to a floating-point number
    const inputValue = parseFloat(displayValue);

    //!! This checks if an operator already exists and if waitingForSecondOperand is set to true. If so, the value of the operator property is replaced with the new operator and the function exits so that no calculations are performed. Neat!
    if (operator && calculator.waitingForSecondOperand)  {
        calculator.operator = nextOperator;
        console.log(calculator);
        return;
      }
    // verify that `firstOperand` is null and that the `inputValue`
    // is not a `NaN` value
    if (firstOperand === null && !isNaN(inputValue)) {
      // Update the firstOperand property
      calculator.firstOperand = inputValue;
    }
    //!This checks if the operator property has been assigned an operator. If so, the calculate function is invoked and the result is saved in the result variable. This result is subsequently displayed to the user by updating the displayValue property. Also, the value of firstOperand is updated to the result so that it may be used in the next calculator.
    //So basically, this will complete the first calculation if another operator is clicked, which then allows the input of the new secondOperand etc. etc.
    else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);

        //calculator.displayValue = String(result);
        //!!! We've replaced the above with the below so that we can limit the number of decimal points in our results; and also so that when it's just a bunch of zeros - then these are removed.
        calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
        //toFixed will set the number of decimal places (to 7 in this case), and parseFloat will convert a whole decimal to a whole integer where appropriate.
        calculator.firstOperand = result;
    }
  
    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
    console.log(calculator);
  }


//Now we need to make sure that the user can enter a second operator after they've entered a secondOperand (i.e. 8 + 2 - 1 = 9):
//We'll create a new function that displays the result on screen and updates "firstOperand" so it can be used in the next expression:

function calculate(firstOperand, secondOperand, operator) {
    //This function takes the first operand, second operand and operator as arguments and checks the value of the operator to determine how the expression should be evaluated. If the operator is =, the second operand will be returned as is.
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
  //Now we need to make sure that the "handleOperator" function will check if the operator property has been assigned an operator. See ! in the handleOperator function for how this is done.


  //Next thing is to make sure that if we change our mind about the function we are using, that we can just select a new operator to override the previous one instead of starting all over.
  //Remember that at the point the operator is entered, waitingForSecondOperand will be set to true since the calculator expects a second operand to be entered after the operator key. We can use this quality to update the operator key and prevent any calculations until the second operand has been inputted. 
  //We'll need to change the handleOperator function again. See !!

  //Lastly, we need to make sure that the user can reset the calculator with the AC key. So we want the AC Key to set the calculator to it's "Default" state. We'll need to create a new funtion for the AC key:

  function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
    console.log(calculator);
  }
//We'll also want to change what happens in the keys eventlistener function so that, when it hears the AC key has been clicked, it runs the above function. See !


//The Decimal Bug:
//If you enter a decimal point after clicking on an operator, it gets appended to the first operand instead of being a part of the second.
//We can fix this by updating the inputDecimal function so that if waitingForSecondOperand is set to true and a decimal point is entered, displayValue becomes 0. and waitingForSecondOperand is set to false so that any additional digits are appended as part of the second operand.
//See ! in inputDecimal.

//The Floating-Point Precision Problem:
//Sometimes, numbers will display off the screen, to prevent that - we can round up the result values using parseInt and Number.toFixed (which sets a number to a fixed number of decimal places)
//We'll need to change the handleOperator function, see !!!

//Done!

function myFunction() {
  var element = document.getElementById("body-c");
  element.classList.toggle("body-c");
}