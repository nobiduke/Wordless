const STARTDAY = 19085;
const MTODAY = 86400

function getWord(){

    let epochTime = ((moment().unix()+1)/MTODAY);
    console.log(Math.floor(epochTime + 1 - STARTDAY))
    let WORDINDEX = Math.floor(epochTime - STARTDAY);
    console.log(CHOSEN[WORDINDEX]);
    return CHOSEN[WORDINDEX];
}

