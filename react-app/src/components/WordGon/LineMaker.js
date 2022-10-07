import LetterLine from "./LetterLine";
import { letterIndexToCoord } from "../../utils/lineFunctions";

export default function LineMaker({ allLetters, guesses, currentGuess, backgroundColor }) {
    let lettersObj = {}
    allLetters.split('').forEach((char, idx) => lettersObj[char] = idx);
    let allCoords = Object.values(letterIndexToCoord)

    return (<>
        {guesses.length > 0 && guesses.map(guess => {
            return guess.split('').slice(1).map((char, letterIdx) => (
                <LetterLine twoIndices={[lettersObj[guess[letterIdx]], lettersObj[guess[letterIdx + 1]]]} backgroundColor={backgroundColor + '70'} />
            ))
        })}
        {currentGuess.length > 1 && currentGuess.split('').slice(1).map((char, letterIdx) => (
            <LetterLine twoIndices={[lettersObj[currentGuess[letterIdx]], lettersObj[currentGuess[letterIdx + 1]]]} backgroundColor={backgroundColor} />
        )
        )}
    </>)
}
