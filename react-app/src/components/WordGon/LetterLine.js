

export default function LetterLine({ twoLetters, letters }) {
    // const unitLength = '4em';
    const unitLength = 4;
    const circleWidth = 4;

    const increment = circleWidth + 2 * unitLength;
    const initLength = unitLength + circleWidth;
    const squareLength = 4 * circleWidth + 6 * unitLength;

    const lettersObj = {};
    for (let i = 0; i < 3; i++) {
        // up
        lettersObj[letters[i]] = [initLength + i * increment, 0];
        // right
        lettersObj[letters[i + 3]] = [squareLength, initLength + i * increment];
        // down
        lettersObj[letters[i + 6]] = [squareLength - initLength - i * increment, squareLength];
        // left
        lettersObj[letters[i + 9]] = [0, squareLength - initLength - i * increment];
    }

    const [x, y] = lettersObj[twoLetters[0]];
    const [xEnd, yEnd] = lettersObj[twoLetters[1]];

    const angle = Math.atan((yEnd - y) / (xEnd - x)) + (xEnd >= x ? 0 : Math.PI);

    const style = {
        top: y + 'em',
        left: x + 'em',
        rotate: angle + 'rad'
    }

    return <div className="letter-line" style={style} />
}
