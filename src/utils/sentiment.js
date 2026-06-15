// hand rolled sentiment detection 

const POSITIVE = ["good","great","love","happy","awesome","excellent","wonderful","fantastic","thanks","thank","nice","cool","amazing","yay","glad","joy","best","fun"];
const NEGATIVE = ["bad","hate","awful","terrible","horrible","sad","angry","upset","worst","annoying","boring","stupid","ugly","disappointed","frustrating","ugh","sucks"];

export const scoreSentiment = (text) => {
    //const words = text.toLowerCase().split(/\s+/);
    const words = text.toLowerCase().split(/\W+/).filter(Boolean);
    let score = 0;
    for (const word of words) {
        if (POSITIVE.includes(word)) score++;
        if (NEGATIVE.includes(word)) score--;
    }
    return score;
};