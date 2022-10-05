
const unitLength = 4;
const circleWidth = 4;
const lineWidth = 1;

const increment = circleWidth + 2 * unitLength;
const initLength = unitLength + circleWidth - lineWidth / 2;
const squareLength = 4 * circleWidth + 6 * unitLength;

export const letterIndexToCoord = {
    '0': [initLength, 0],
    '1': [initLength + increment, 0],
    '2': [initLength + 2 * increment, 0],
    '3': [squareLength, initLength],
    '4': [squareLength, initLength + increment],
    '5': [squareLength, initLength + 2 * increment],
    '6': [initLength + 2 * increment, squareLength],
    '7': [initLength + increment, squareLength],
    '8': [initLength, squareLength],
    '9': [0, initLength + 2 * increment],
    '10': [0, initLength + increment],
    '11': [0, initLength]
}

// to be deleted
// const unitLength = 4;
// const circleWidth = 4;

// const increment = circleWidth + 2 * unitLength;
// const initLength = unitLength + circleWidth;
// const squareLength = 4 * circleWidth + 6 * unitLength;

// const lettersObj = {};
// for (let i = 0; i < 3; i++) {
//     // up
//     lettersObj[letters[i]] = [initLength + i * increment, 0];
//     // right
//     lettersObj[letters[i + 3]] = [squareLength, initLength + i * increment];
//     // down
//     lettersObj[letters[i + 6]] = [squareLength - initLength - i * increment, squareLength];
//     // left
//     lettersObj[letters[i + 9]] = [0, squareLength - initLength - i * increment];
// }
