import LetterLine from "./LetterLine";

export default function LineMaker({ allLetters, guesses, currentGuess, backgroundColor }) {
    let lettersObj = {}
    allLetters.split('').forEach((char, idx) => lettersObj[char] = idx);


    return (<>
        {guesses.map(guess => {
            return guess.split('').slice(1).map((char, letterIdx) => (
                <LetterLine twoIndices={[lettersObj[guess[letterIdx]], lettersObj[guess[letterIdx + 1]]]} backgroundColor={backgroundColor + '70'} />
            ))
        })}
        {currentGuess.split('').slice(1).map((char, letterIdx) => (
            <LetterLine twoIndices={[lettersObj[currentGuess[letterIdx]], lettersObj[currentGuess[letterIdx + 1]]]} backgroundColor={backgroundColor} />
        )
        )}
    </>)
}