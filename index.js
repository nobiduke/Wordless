
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
let totalScore = 0;
let wordScore = 0;

function chooseWord(){
    let index = Math.round(Math.random()*(ANSWER_AMOUNT-1));
    return ANSWERS[index];
};

function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent.charAt(0) === letter) {
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
    let scoreBox = document.createElement("span");
    scoreBox.setAttribute("id", "row-"+number.toString()+"score-box");
    scoreBox.setAttribute("class", "score-box");
    row.appendChild(scoreBox);

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

function addScore(amount, rowNum){
    wordScore += amount;
    let box = document.getElementById(`row-${rowNum}score-box`);
    box.innerHTML = wordScore.toString();
}

function removeScore(amount, rowNum){
    wordScore -= amount;
    let box = document.getElementById(`row-${rowNum}score-box`);
    if (wordScore != 0){
        box.innerHTML = wordScore.toString();
    }
    else{
        box.innerHTML = "";
    }
}

function getKeyValue(rowNum, colNum){
    let box = document.getElementById(`row-${rowNum}letter-${colNum}`);
    return box.innerHTML;
}

document.addEventListener("keyup", function(event){
    // console.log(wordList);
    if (gameOver){return;}
    let key = String(event.key);
    
    if (key == "Backspace" && wordList.length > 0){
        removeScore(L_POINTS[getKeyValue(rowNumber, colNumber-1)], rowNumber);
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
            totalScore += wordScore;
            wordScore = 0;
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
        addScore(L_POINTS[toAdd], rowNumber);
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
    else if(wordHateAsList.includes(key.charAt(0))){
        return;
    }

    if(key != "Backspace" && key != "Enter"){
        key = key.charAt(0);
    }

    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}));
});


function startGame(){
    wordHate.textContent = getWord();
    wordHateAsList = wordHate.textContent.split("");
}

function calcScore(letters){
    let score = 0;
    for (const letter of letters){
        score += L_POINTS[letter];
    }
    return score;
}


function restartGame (e, value){
    if (!value){
        // this is very neccessary, took like 2 hours one night at 2 am
        restartButton.blur();
        const target = e.target;
        
        if (!target.classList.contains("restart")) {
            return;
        }
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
    totalScore = 0;
    wordScore = 0;
}


restartButton.addEventListener("click", function(e){
    restartGame(e, false);
});


wordHateStart.textContent = "The word we hate today is:";
let wordHateAsList = [];
startGame();
let lettersLeft = [];
for (const elem of document.getElementsByClassName("keyboard-button")){
    if (elem.textContent != "Del" && elem.textContent != "Enter"){
        elem.innerHTML = elem.innerHTML + "<sub>" + L_POINTS[elem.textContent] + "</sub>";
    }
}
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
        restartGame(None, true);
    }
}, 1000);
