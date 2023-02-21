import { useState, useEffect } from "react";
import LetterLine from "./LetterLine";
import { letterIndexToCoord, lineAnimations } from "../../utils/lineFunctions";

export default function LineMaker({ allLetters, guesses, currentGuess, backgroundColor }) {
    let lettersObj = {}
    allLetters.split('').forEach((char, idx) => lettersObj[char] = idx);

    return (<>
        {guesses.length > 0 && guesses.map((guess, guessIdx) => {
            return guess.split('').slice(1).map((char, letterIdx) => (
                <LetterLine key={`${guessIdx},${guess[letterIdx]},${guess[letterIdx + 1]}`} twoIndices={[lettersObj[guess[letterIdx]], lettersObj[guess[letterIdx + 1]]]} backgroundColor={backgroundColor + '70'} />
            ))
        })}
        {currentGuess.length > 1 && currentGuess.split('').slice(1).map((char, letterIdx) => (
            <LetterLine key={`${currentGuess[letterIdx]},${currentGuess[letterIdx + 1]}`} twoIndices={[lettersObj[currentGuess[letterIdx]], lettersObj[currentGuess[letterIdx + 1]]]} backgroundColor={backgroundColor} />
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

        const angle = Math.atan((yEnd - y) / (xEnd - x)) + (xEnd >= x ? 0 : Math.PI);

        const style = {
            top: y + 'em',
            left: x + 'em',
            rotate: angle + 'rad',
            backgroundColor: 'black',
            animationDelay: `${time}s`,
            animationDuration: length / 50 + 's',
            zIndex: '1'
        }
        time += length / 50

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

export function AnimatedLineMaker2({ allLetters, currentGuess, setAnimating }) {
    let lettersObj = {};
    allLetters.split('').forEach((char, idx) => lettersObj[char] = idx);

    const [aninumber, setAninumber] = useState(-1);

    function sequenceAnimation(e) {
        if (aninumber < currentGuess.length - 2) {
            setAninumber(num => num + 1)
            return
        }
        setAnimating(false);
    }

    useEffect(() => {
        setAninumber(0)
    }, [])

    let styles = [];
    let animations = [];

    for (let i = 1; i < currentGuess.length; i++) {
        let indices = [lettersObj[currentGuess[i - 1]], lettersObj[currentGuess[i]]];

        const coordsStart = letterIndexToCoord[indices[0]];
        const coordsEnd = letterIndexToCoord[indices[1]];

        animations.push(lineAnimations[indices.sort((a, b) => a - b).join('-')]);

        const x = coordsStart[0];
        const y = coordsStart[1];
        const xEnd = coordsEnd[0];
        const yEnd = coordsEnd[1];

        const angle = Math.atan((yEnd - y) / (xEnd - x)) + (xEnd >= x ? 0 : Math.PI);

        const style = {
            top: y + 'em',
            left: x + 'em',
            rotate: angle + 'rad',
            backgroundColor: 'black',
            zIndex: '1'
        }

        styles.push(style);
    }

    return styles.map((style, idx) => (aninumber >= idx ?
        <div
            className={`letter-line animated animated-${animations[idx]}`}
            style={style}
            onAnimationEnd={sequenceAnimation}
            key={'letter-line-animated,' + idx}
        /> : null
    ))
}
