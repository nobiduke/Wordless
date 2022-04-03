import moment from './node_modules/moment/moment.js';

const W_LENGTH = 5;
const GUESS_AMOUNT = 6;
const ANSWER_AMOUNT = 2315

let wordHateStart = document.getElementById("hate");
let rowContainer = document.getElementById("rowContainer");
let wordHate = document.getElementById("wordOfTheDay");
let restartButton = document.getElementById("restart-button");

let gameOver = false;
let wordChoice = String;
let lettersGuessed = [];
let wordList = [];

let rowNumber = 0;
let colNumber = 0;

function chooseWord(){
    let index = Math.round(Math.random()*(ANSWER_AMOUNT-1));
    return ANSWERS[index];
};

function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor;
            if (oldColor === 'darkgreen') {
                return;
            }

            elem.style.backgroundColor = color;
            break;
        }
    }
}


function checkWord(word){
    // console.log(colNumber)
    // console.log(word.length)
    // console.log(word)
    if (word.length != W_LENGTH){
        alert("Word isn't long enough.")
        return false;
    }
    else if(!GUESSES.includes(word)){
        alert("\""+ word + "\" is not in the word list!")
        return false;
    } 
    else{
        for (const letter of wordList){
            for (const reference of wordHateAsList){
                // console.log(letter + "\t" + reference);
                if (letter == reference){
                    alert("Word contains letters from the hated word, how dare you?");
                    return false;
                }
                else if(lettersGuessed.includes(letter)){
                    alert("You have already used one of those letters");
                    return false;
                }
            }
        }

    }
    return true;
};


// function alphaOnly(event) {
//     var key = event.keyCode;
//     // from A-Z to a-z and backspace
//     return ((key >= 65 && key <= 90) || key == 8);
// };


function createEmptyLetter(colNum, rowNum){
    let letter = document.createElement("span");
    letter.setAttribute("id", "row-" + rowNum.toString() + "letter-"+colNum.toString());
    letter.setAttribute("class", "letter");
    return letter;
};


function checkWin(){
    if (lettersLeft.length < 5){
        return true;
    }
    return false;
}


function createEmptyRow(number, where){
    // initialize the row
    let row = document.createElement("div");
    row.setAttribute("id", ("row-"+number.toString()));
    row.setAttribute("class", "row");
    
    // fill the row with letters
    for (let i = 0;i<5;i++){
        row.appendChild(createEmptyLetter(i, number));
    }
    where.appendChild(row);
};


function insertLetter(rowNum, colNum, letter){
    let box = document.getElementById(`row-${rowNum}letter-${colNum}`);
    box.innerHTML = letter;
};

function removeLetter(rowNum, colNum){
    let box = document.getElementById(`row-${rowNum}letter-${colNum}`);
    box.innerHTML = "";
}

document.addEventListener("keyup", function(event){
    // console.log(wordList);
    if (gameOver){return;}
    let key = String(event.key);
    
    if (key == "Backspace" && wordList.length > 0){
        removeLetter(rowNumber, colNumber-1);
        wordList.pop();
        colNumber--;
        return;
    }

    if (key == "Enter"){
        // console.log(wordList);
        // console.log(lettersLeft);

        wordChoice = wordList.join("");
        if(checkWord(wordChoice)){
            rowNumber++;
            for (const letter of wordList){
                lettersGuessed.push(letter);
                shadeKeyBoard(letter, 'darkgreen');
            }

            lettersLeft = lettersLeft.filter(function(value){if(!wordList.includes(value)){return value}})

            if (rowNumber > 4){
                if (checkWin()){
                    gameOver = true;
                    alert("Victory in " + (rowNumber) + " guesses!")
                }
            }
            if (!gameOver){
                colNumber = 0;
                wordList = [];
                createEmptyRow(rowNumber, rowContainer);
            }
        }

        return;
    }

    let toAdd = key.match(/[a-z]/gi);
    if(!toAdd || toAdd.length > 1 || colNumber == W_LENGTH){
        return;
    } else{
        toAdd = String(toAdd).toLowerCase();

        if(wordHateAsList.includes(String(toAdd))){
            return;
        }
        
        insertLetter(rowNumber, colNumber, toAdd);
        wordList.push(toAdd);
        // console.log(wordList);
        colNumber++;
    }

});


document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target;
    target.blur()
    
    if (!target.classList.contains("keyboard-button")) {
        return;
    }
    let key = target.textContent;

    if (key == "Del") {
        key = "Backspace";
    }
    if(wordHateAsList.includes(key)){
        return;
    }

    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}));
});


function startGame(){
    wordHate.textContent = chooseWord();
    wordHateAsList = wordHate.textContent.split("");
}


restartButton.addEventListener("click", function restartGame (e){
    // this is very neccessary, took like 2 hours one night at 2 am
    restartButton.blur();
    const target = e.target;
    
    if (!target.classList.contains("restart")) {
        return;
    }
    // removes all rows except for the first
    for (let i = rowNumber; i > 0; i--) {
        let child = document.getElementById("row-" + i.toString());
        rowContainer.removeChild(child);
    }
    // resets the first row
    for (let i = 0; i < W_LENGTH; i++) {
        removeLetter(0, i);
    }
    // resets keyboard
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.style.backgroundColor === 'darkgreen') {
            elem.style.backgroundColor = '#333333';
        }
    }
    rowNumber = 0;
    colNumber = 0;
    lettersGuessed = [];
    wordChoice = String;
    wordList = [];
    gameOver = false;
    
});


wordHateStart.textContent = "The word we hate today is:";
let wordHateAsList = [];
startGame();
let lettersLeft = [];
for (const letter of wordHateAsList){
    shadeKeyBoard(letter, 'black');
}
for (const letter of ALPHABET){
    if(!wordHateAsList.includes(letter)){
        lettersLeft.push(letter)
    }
}

// console.log(lettersLeft)

createEmptyRow(0, rowContainer);

setInterval(function(){
    now = moment().format('h:mm:ss');
    if (now == "0:00:00"){
        startGame();
        restartGame();
    }
}, 1000);
