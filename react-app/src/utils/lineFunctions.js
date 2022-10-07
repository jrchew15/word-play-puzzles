
const unitLength = 4;
const circleWidth = 4;
const lineWidth = 1;
const borderWidth = 0.6;

const increment = circleWidth + 2 * unitLength;
const initLength = unitLength + circleWidth;
const squareLength = 4 * circleWidth + 6 * unitLength;

export const letterIndexToCoord = {
    '0': [-borderWidth / 2 + initLength, - lineWidth / 2],
    '1': [-borderWidth / 2 + initLength + increment, - lineWidth / 2],
    '2': [-borderWidth / 2 + initLength + 2 * increment, - lineWidth / 2],
    '3': [-borderWidth / 2 + squareLength, initLength - lineWidth / 2],
    '4': [-borderWidth / 2 + squareLength, initLength + increment - lineWidth / 2],
    '5': [-borderWidth / 2 + squareLength, initLength + 2 * increment - lineWidth / 2],
    '6': [-borderWidth / 2 + initLength + 2 * increment, squareLength - lineWidth / 2],
    '7': [-borderWidth / 2 + initLength + increment, squareLength - lineWidth / 2],
    '8': [-borderWidth / 2 + initLength, squareLength - lineWidth / 2],
    '9': [0 - borderWidth / 2, initLength + 2 * increment - lineWidth / 2],
    '10': [0 - borderWidth / 2, initLength + increment - lineWidth / 2],
    '11': [0 - borderWidth / 2, initLength - lineWidth / 2]
}
