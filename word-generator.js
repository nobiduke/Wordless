const STARTDAY = 19085;
const MTODAY = 86400

function getWord(){

    let epochTime = ((moment().unix()+1)/MTODAY);
    let WORDINDEX = Math.floor(epochTime - STARTDAY);
    return CHOSEN[WORDINDEX];
}

