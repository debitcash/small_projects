/* 
    Creator: @debitcash
    Each number on the top and bottom displays is represented as a collection of styled <div> elements, 
    mimicking the segmented appearance of digits on real calculators. 
    Each digit consists of 4 vertical and 3 horizontal segments, which are colored in specific combinations 
    to resemble calculator-like digits.

    Initially, both displays are populated with "greyed-out" segments that look like the number 8. 
    When a user clicks a number button, the bottom display updates its segments to represent the chosen digit, 
    while also appending the value to a string buffer. After selecting an operation, the calculation is performed using two operands 
    parsed from the strings associated with each display.
*/

let bottomNumber = 0;
let topNumber = 0;
let operator = '';

// store string representation of top and bottom display numbers
let topDisplayBuffer = '';
let bottomDisplayBuffer = '';

// template html for one greyed out digit, includes 7 dashes: 3 horizontal and 4 vertical
let numberHtml =` <div class="digit">
      <div class="horizontal" id="one">
        <div class="left"></div>
        <div class="center"></div>
        <div class="right"></div>
      </div>

      <div class="verticalContainer">
        <div class="vertical" id="four">
          <div class="top"></div>
          <div class="center"></div>
          <div class="bottom"></div>
        </div>
        <div class="vertical" id="five">
          <div class="top"></div>
          <div class="center"></div>
          <div class="bottom"></div>
        </div>
      </div>

      <div class="horizontal" id="two">
        <div class="left"></div>
        <div class="center"></div>
        <div class="right"></div>
      </div>

      <div class="verticalContainer">
        <div class="vertical" id="six">
          <div class="top"></div>
          <div class="center"></div>
          <div class="bottom"></div>
        </div>
        <div class="vertical" id="seven">
          <div class="top"></div>
          <div class="center"></div>
          <div class="bottom"></div>
        </div>
      </div>

      <div class="horizontal" id="three">
        <div class="left"></div>
        <div class="center"></div>
        <div class="right" ></div>
    </div>`

// populate the top and bottom display with 6 greyed out digit containers on the start
let topNumberContainer = document.querySelector('.topDisplay');
let bottomNumberContainer = document.querySelector('.bottomDisplay');

function initialDisplaySetup(container){
    container.innerHTML= '';

    for (let i=0; i < 6; i++)
    {
        container.innerHTML += numberHtml
    }
}

initialDisplaySetup(topNumberContainer);
initialDisplaySetup(bottomNumberContainer);

// store the references to the freshly populated digit containers
let bottomDigitContainer = [...document.querySelectorAll('.bottomDisplay .digit')];
let topDigitContainer = [...document.querySelectorAll('.topDisplay .digit')];

// each symbol has fragments(dashes) to be painted, in order to make the digit holder div look like a number
const digitSegments = {'0':['one', 'four', 'five', 'six', 'seven', 'three'],
    '1':['five','seven'],
    '2':['one', 'five', 'two', 'six', 'three'],
    '3':['one', 'five', 'two', 'three', 'seven'],
    '4':['four', 'two', 'five', 'seven'],
    '5':['one', 'four', 'two', 'seven', 'three'],
    '6':['one', 'four', 'two', 'six', 'seven', 'three'],
    '7':['one', 'five', 'seven'],
    '8':['one', 'two', 'three', 'four', 'five', 'six', 'seven'],
    '9':['one', 'two', 'three', 'four', 'five', 'seven'],
    '.':['three'],
    '-':['two'],
    'P':['six', 'four', 'two', 'one', 'five'],
    'S':['one', 'four', 'two', 'seven', 'three']
}

// service funtion to paint a single fragment(dash)
function paintFragment(fragment, color){
    if (fragment.classList[0] == 'vertical')
    {
        let topChild = fragment.querySelector('.top');
        let centerChild = fragment.querySelector('.center');
        let bottomChild = fragment.querySelector('.bottom');

        topChild.style.borderBottomColor = color;
        centerChild.style.backgroundColor = color;
        bottomChild.style.borderTopColor = color;
    }
    else
    {
        let leftChild = fragment.querySelector('.left');
        let centerChild = fragment.querySelector('.center');
        let rightChild = fragment.querySelector('.right');

        leftChild.style.borderRightColor = color;
        centerChild.style.backgroundColor = color;
        rightChild.style.borderLeftColor = color;
    }    
}

// paints the whole digit
function displayDigit(numberStr,itemIndex, container){
    let segmentsToPaint = digitSegments[numberStr];

    let selectedContainer = container[itemIndex];
    let selectedFragments = selectedContainer.querySelectorAll('.vertical,.horizontal')

    for (let i = 0; i < selectedFragments.length; i++){
        if (segmentsToPaint.includes(selectedFragments[i].id))
        {
            paintFragment(selectedFragments[i], '#39ff14');
        }
    }
}

function clearBottomDisplay(){
    for (let i = 0; i < bottomDisplayBuffer.length; i++){
            let selectedContainer = bottomDigitContainer[i];
            let selectedFragments = selectedContainer.querySelectorAll('.vertical,.horizontal')

            for (let i = 0; i < selectedFragments.length; i++)
            {
                paintFragment(selectedFragments[i], '#2e2e2e');
            }
    }
}

function clearTopDisplay(){
    for (let i = 0; i < topDisplayBuffer.length; i++){
            let selectedContainer = topDigitContainer[i];
            let selectedFragments = selectedContainer.querySelectorAll('.vertical,.horizontal')

            for (let i = 0; i < selectedFragments.length; i++)
            {
                paintFragment(selectedFragments[i], '#2e2e2e');
            }
    }
}

function populateTopDisplay(numberStr){
    clearTopDisplay();
    for (let i = 0; i < numberStr.length; i++){
            displayDigit(numberStr[i], i, topDigitContainer);
    }
}

function populateBottomDisplay(numberStr){
    clearBottomDisplay();
    for (let i = 0; i < numberStr.length; i++){
            displayDigit(numberStr[i], i, bottomDigitContainer);
    }
}

// handle the function assignment to number buttons
let digitButtons = document.querySelectorAll('.digitButton');

digitButtons.forEach((element, index) => {element.addEventListener("click", (event) => 
    {
        // handle situation, when user starts new calculation without cleaning the result of previous operation
        if (topDisplayBuffer != '' && operator ==='')
        {
            clearTopDisplay();
            topDisplayBuffer = '';
        } 

        // don't append the char to the number if it is already 6 chars long
        if (bottomDisplayBuffer.length == 6) return;

        if (index == 10)
            bottomDisplayBuffer += '0';
        else if (index ==9){
            // prevent multiple period chars
            if (bottomDisplayBuffer.includes('.'))
                return;
            bottomDisplayBuffer += '.';
        }
        else 
            bottomDisplayBuffer += index + 1;

        displayDigit(bottomDisplayBuffer[bottomDisplayBuffer.length - 1] , bottomDisplayBuffer.length - 1, bottomDigitContainer);
    } );} );

// handle the function assignment to equal button
let equalsButton = document.querySelector('#equalsButton');
equalsButton.addEventListener("click", (event)=>{
    if (bottomDisplayBuffer === '' || topDisplayBuffer=== '')
    {
        return;
    }

    if (topDisplayBuffer == '00PS')
    {
        clearTopDisplay();
        topDisplayBuffer = '';
        return;
    }
        
    bottomNumber = parseFloat(bottomDisplayBuffer);

    clearBottomDisplay();
    clearTopDisplay();
    topNumber = operate(operator, topNumber, bottomNumber)
    topDisplayBuffer = topNumber.toString();
    
    // handle situation when the result is longer than 6 chars
    if (topDisplayBuffer.length > 6)
    {
        // trim the long floats 
        if (topDisplayBuffer.substring(0, 5).includes('.'))
        {
            topDisplayBuffer = topDisplayBuffer.substring(0, 6);
            console.log(topDisplayBuffer);
        }
        else{
            bottomDisplayBuffer='';
            topDisplayBuffer='00PS';
            populateTopDisplay("00PS");
            bottomNumber =0;
            topNumber=0;
            return;
        }
        
    }
    
    populateTopDisplay(topDisplayBuffer);
    bottomDisplayBuffer='';
    operator = '';
});

let clearAllButton = document.querySelector('#clearAllButton');
clearAllButton.addEventListener("click", (event)=>{
    clearBottomDisplay();
    bottomDisplayBuffer='';
    clearTopDisplay();
    topDisplayBuffer='';
});

let backspace = document.querySelector('#backspace');
backspace.addEventListener("click", (event)=>{
    clearBottomDisplay();
    let newBuffer = bottomDisplayBuffer.length - 1;
    bottomDisplayBuffer = bottomDisplayBuffer.substring(0, newBuffer);
    populateBottomDisplay(bottomDisplayBuffer);
});

let genericOperation = (operatorStr) =>{
    if (topDisplayBuffer == '00PS')
    {
        clearTopDisplay();
        topDisplayBuffer = '';
        operator = '';
        return;
    }

    // handles situation, when user does operations one by one without pressing the equals
    if (topDisplayBuffer != '' && bottomDisplayBuffer != '')
    {
        equalsButton.click();
        operator = operatorStr;
        return;
    }

    clearBottomDisplay();
    bottomNumber = parseFloat(bottomDisplayBuffer)

    operator = operatorStr;

    if (isNaN(bottomNumber))
    {
        return;
    }

    else if (topDisplayBuffer != '')
    {
        equalsButton.click();
        return;
    }

    populateTopDisplay(bottomDisplayBuffer);
    topDisplayBuffer = bottomDisplayBuffer;
    bottomDisplayBuffer = '';
    topNumber = bottomNumber;
    bottomNumber = 0;
};

// assign the appropriate functions to operator buttons
let plusButton = document.querySelector('#plusButton');
let minusButton = document.querySelector('#minusButton');
let multiplyButton = document.querySelector('#multiplyButton');
let divideButton = document.querySelector('#divideButton');

plusButton.addEventListener("click", () => genericOperation('+'));
minusButton.addEventListener("click", () => genericOperation('-'));
multiplyButton.addEventListener("click", () => genericOperation('*'));
divideButton.addEventListener("click", () => genericOperation('/'));

// setup calculations
function add(num1, num2)
{
    return num1 + num2;
}

function substract(num1, num2)
{
    return num1 - num2;
}

function multiply(num1, num2)
{
    return num1 * num2;
}

function divide(num1, num2)
{
    return num1 / num2;
}

function operate(operator, num1, num2)
{
    if (operator == '+')
        return add(num1, num2)
    else if (operator == '-')
        return substract(num1, num2);
    else if (operator == '*')
        return multiply(num1, num2);
    else if (operator == '/')
        return divide(num1, num2);
}
