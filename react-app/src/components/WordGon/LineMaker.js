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

export function AnimatedLineMaker({ allLetters, currentGuess, setAnimating }) {
    let lettersObj = {}
    allLetters.split('').forEach((char, idx) => lettersObj[char] = idx);
    // let allCoords = Object.values(letterIndexToCoord)

    let time = 0;
    let styles = []

    for (let i = 1; i < currentGuess.length; i++) {
        const coordsStart = letterIndexToCoord[lettersObj[currentGuess[i - 1]]];
        const coordsEnd = letterIndexToCoord[lettersObj[currentGuess[i]]];
        const x = coordsStart[0];
        const y = coordsStart[1];
        const xEnd = coordsEnd[0];
        const yEnd = coordsEnd[1];

        const length = Math.sqrt((x - xEnd) ** 2 + (y - yEnd) ** 2);
        time += length / 70

        const angle = Math.atan((yEnd - y) / (xEnd - x)) + (xEnd >= x ? 0 : Math.PI);

        const style = {
            top: y + 'em',
            left: x + 'em',
            rotate: angle + 'rad',
            backgroundColor: 'black',
            animationDelay: `${time}s`,
            zIndex: '1'
        }

        styles.push(style)
    }

    return (
        styles.map((style, idx) => <div className="letter-line animated" style={style} key={'letter-line,' + idx} onAnimationEnd={() => onAnimationEnd(idx)} />)
    )

    function onAnimationEnd(idx) {
        if (idx === styles.length - 1) {
            setAnimating(false)
        }
    }
}
