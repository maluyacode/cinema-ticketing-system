export const cutSentence = (sentence, wordLength = 0) => {
    if (wordLength === 0) {
        return sentence;
    } else {
        return sentence.split(' ').slice(0, wordLength).join(' ') + '...';
    }
}