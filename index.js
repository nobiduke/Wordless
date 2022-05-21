
const W_LENGTH = 5;
const GUESS_AMOUNT = 6;
const ANSWER_AMOUNT = 2315;
const KEY_BASE_COLOR = "#444444"; // light gray
const USED_CONSONANT_COLOR = 'darkgreen'; // castleton green
const USED_VOWEL_COLOR = "dodgerblue"; // #005A9C dodgers blue

let wordHateStart = document.getElementById("hate");
let rowContainer = document.getElementById("rowContainer");
let wordHate = document.getElementById("wordOfTheDay");
let restartButton = document.getElementById("restart-button");

let startingUp = true;
let gameOver = false;
let wordChoice = String;
let lettersGuessed = [];
let wordsGuessed = [];
let wordList = [];
let overallPoints = 0;
let overallRounds = 0;

let rowNumber = 0;
let colNumber = 0;
let totalScore = 0;
let wordScore = 0;

function isVowel(value){
    if (value == 'a' || value == 'e' || value == 'i' || value == 'o' || value == 'u'){
        return true;
    }
    return false;
}

function chooseWord(){
    let index = Math.round(Math.random()*(ANSWER_AMOUNT-1));
    return ANSWERS[index];
};

function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent.charAt(0) === letter) {
            let oldColor = elem.style.backgroundColor;
            if (oldColor === USED_CONSONANT_COLOR) {
                return;
            }

            elem.style.backgroundColor = color;
            break;
        }
    }
}


function checkWord(word){

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

                if (letter == reference){
                    alert("Word contains letters from the hated word, how dare you?");
                    return false;
                }

            }
            if(!lettersLeft.includes(letter) && !isVowel(letter)){
                alert("You have already used one of those consonants");
                return false;
            }
            if(isVowel(letter)){
                if (VOWELS[letter] < 0){
                    VOWELS[letter] = rowNumber;
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
    if (lettersLeft.length == 0){
        return true;
    }
    return false;
}


function createShareText(){
    let outputText = "Wordless: " + String(totalScore) + " points" + '\n';
    let containerChildren = document.getElementById("rowContainer").children;
    for (let i = 0; i < containerChildren.length; i++){
        let rowChildren = containerChildren[i].children;
        
        for(let j = 0; j < rowChildren.length; j++){
            if(j < W_LENGTH){
                if (isVowel(rowChildren[j].innerHTML)){
                    outputText += "⬛";
                }
                else{
                    outputText += "🟩";
                }
            }
            else{
                outputText += " " + String(rowChildren[j].innerHTML);
            }
        }
        outputText += '\n';
    }
    return outputText;
}


function victoryPopup() {
    let vText = document.getElementById("victory-text");
    vText.innerHTML = `Victory in ${rowNumber+1} guesses\n ${totalScore} points\n\n\n Average Score: ${overallPoints/overallRounds}`;
    vText.innerHTML += `\nTotal Rounds Played: ${overallRounds} \nTotal Points Scored: ${overallPoints}`;
    
    let outputText = createShareText();
    
    let shareButton = document.getElementById("share-button");
    shareButton.addEventListener("click", function(e){
        if (navigator.share && navigator.userAgent != "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36") {
            navigator.share({
                title: document.title,
                text: createShareText(),
                url: window.location.href
            })
            .then(() => console.log('Successful share'))
            .catch(error => console.log('Error sharing:', error));
        }
        
        alert("Copied to clipboard");
        navigator.clipboard.writeText(outputText);
        popup.classList.toggle("show");
    });
    shareButton.blur();
    let popup = document.getElementById("the-popup");
    popup.classList.toggle("show");
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

function removeRow(rowNum, where){
    let box = document.getElementById(`row-${rowNum}`);
    let score = parseInt(document.getElementById(`row-${rowNum-1}score-box`).innerHTML);
    where.removeChild(box);
    rowNumber--;
    colNumber = 5;
    let lettersAdded = [];
    // resets the lists that store values
    for (let i = 0; i < 5; i++){
        let value = getKeyValue(rowNumber, i);
        if((!lettersAdded.includes(value)) && !isVowel(value)){
            lettersAdded.push(value);
            lettersGuessed.pop();
            lettersLeft.push(value);
        }
        wordList.push(value);
    }
    totalScore -= score;
    wordScore = score;
    // resets keyboard
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        let value = elem.innerHTML.charAt(0);

        if (lettersLeft.includes(value)) {
            elem.style.backgroundColor = KEY_BASE_COLOR;
        }
        if(isVowel(value)){
            if(VOWELS[value] == rowNumber){
                elem.style.backgroundColor = KEY_BASE_COLOR;
                VOWELS[value] = -1;
            }
        }
    }
}

document.addEventListener("keyup", function(event){

    if (gameOver){return;}
    let key = String(event.key);
    if (key == "Backspace"){
        if (colNumber == 0){
            if(rowNumber > 0){
                removeRow(rowNumber, rowContainer);
                wordsGuessed.pop();
                let midnight = new Date();
                midnight.setHours(23,59,59,0);
                document.cookie = "words= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
                document.cookie = `words=${wordsGuessed.toString()}; expires=${midnight}`;
            }
        }
        else{
            removeScore(L_POINTS[getKeyValue(rowNumber, colNumber-1)], rowNumber);
            removeLetter(rowNumber, colNumber-1);
            wordList.pop();
            colNumber--;
            return;
        }
    }

    if (key == "Enter"){

        wordChoice = wordList.join("");
        if(checkWord(wordChoice)){
            totalScore += wordScore;

            rowNumber++;
            wordScore = 0;
            for (const letter of wordList){
                if (!lettersGuessed.includes(letter)){
                    lettersGuessed.push(letter);
                }
                if (isVowel(letter)){
                    shadeKeyBoard(letter, USED_VOWEL_COLOR);
                }
                else{
                    shadeKeyBoard(letter, USED_CONSONANT_COLOR);
                }
            }
            
            lettersLeft = lettersLeft.filter(function(value){
                if(!wordList.includes(value)){
                    return value;
                }
                // else if(isVowel(value)){
                //     return value;
                // }
            });

            if (!startingUp){
                wordsGuessed.push(wordChoice);
                let midnight = new Date();
                // let nineMonths = new Date();
                // nineMonths.setMonth(nineMonths.getMonth()+9)
                midnight.setHours(23,59,59,0);
                document.cookie = "words= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
                document.cookie = `words=${wordsGuessed.toString()}; expires=${midnight}`;
            }

            if (rowNumber > 2){
                if (checkWin()){
                    gameOver = true;
                    rowNumber--;
                    console.log(`Victory with ${totalScore} points`);
                    let nineMonths = new Date();
                    nineMonths.setMonth(nineMonths.getMonth()+9);
                    overallPoints += totalScore;
                    overallRounds += 1;
                    document.cookie = `rounds=${overallRounds}; expires${nineMonths}`;
                    document.cookie = `points=${overallPoints}; expires${nineMonths}`;

                    victoryPopup();
                }
            }
            if (!gameOver && !startingUp){
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
        
        colNumber++;
    }

});


document.getElementById("keyboard-cont").addEventListener("click", (e) => {

    let target = e.target;

    if (!target.classList.contains("keyboard-button")) {
        target = target.parentNode;
        if (!target.classList.contains("keyboard-button")){
            return;
        }
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
    target.blur();
});


function startGame(){
    wordHate.textContent = getWord();
    wordHateAsList = wordHate.textContent.split("");
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
        if (elem.style.backgroundColor === USED_CONSONANT_COLOR || elem.style.backgroundColor == USED_VOWEL_COLOR) {
            elem.style.backgroundColor = KEY_BASE_COLOR;
        }

    }

    lettersLeft = []
    for (const letter of ALPHABET){
        if(!wordHateAsList.includes(letter)){
            lettersLeft.push(letter)
        }
    }

    document.cookie = "words= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
    wordsGuessed = [];
    rowNumber = 0;
    colNumber = 0;
    lettersGuessed = [];
    wordChoice = String;
    wordList = [];
    gameOver = false;
    totalScore = 0;
    removeScore(wordScore, 0);
}

restartButton.addEventListener("click", function(e){
    restartGame(e, false);
});

function fillRows(wordsToAdd){
    let row = 0;
    for(row; row < wordsToAdd.length; row++){
        createEmptyRow(row, rowContainer);
        for(let col = 0; col < W_LENGTH; col++){
            insertLetter(row, col, wordsToAdd[row].charAt(col));
            addScore(L_POINTS[wordsToAdd[row][col]], row);
        }
        let temp = String(wordsToAdd[row]);
        wordList = temp.split("");
        document.dispatchEvent(new KeyboardEvent("keyup", {'key': 'Enter'}));
    }
    wordList = [];
    return row;
}

// the start of the page

let startRow = 0;
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

let nineMonths = new Date();
nineMonths.setMonth(nineMonths.getMonth()+9)

if (!document.cookie){
    let midnight = new Date();

    midnight.setHours(23,59,59,0);
    document.cookie = `words=; expires=${midnight}`;
    document.cookie = `rounds=0; expires=${nineMonths}`;
    document.cookie = `points=0; expires=${nineMonths}`; 

} else{
    console.log(document.cookie);
    splitcookie = document.cookie.split(';')
    let cook = [];
    for (const cooky of splitcookie){
        if (cooky.split('=')[0] == 'words' || cooky.split('=')[0] == ' words'){
            for (const word of cooky.split('=')[1].split(',')){
                cook.push(word);
            }
        }
        else if(cooky.split('=')[0] == 'rounds' || cooky.split('=')[0] == ' rounds'){
            overallRounds = parseInt(cooky.split('=')[1]);
        } 
        else if (cooky.split('=')[0] == 'points' || cooky.split('=')[0] == ' points'){
            overallPoints = parseInt(cooky.split('=')[1]);
        }
    }
    if(splitcookie.length < 2){
        document.cookie = `rounds=0; expires=${nineMonths}`;
        document.cookie = `points=0; expires=${nineMonths}`;
    }
    let wordsToAdd = [];
    console.log(cook);
    if(cook){
        for (const word of cook){
            if (word){
                wordsToAdd.push(word);
            }
        }
        startRow = fillRows(wordsToAdd);
        wordsGuessed = wordsToAdd;
    }
}

startingUp = false;
if (!gameOver){    
    createEmptyRow(startRow, rowContainer);
}

setInterval(function(){
    now = moment().format('h:mm:ss');
    let midnight = new Date();
    midnight.setHours(23,59,59,0);

    if (now == "0:00:00"){
        document.cookie = `words=0; expires=${midnight}`;
        startGame();
        restartGame(None, true);
    }
}, 1000);
