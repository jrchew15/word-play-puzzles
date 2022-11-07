
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
    '9': [-borderWidth / 2, initLength + 2 * increment - lineWidth / 2],
    '10': [-borderWidth / 2, initLength + increment - lineWidth / 2],
    '11': [-borderWidth / 2, initLength - lineWidth / 2]
}

export const lineAnimations = {
    '0-3': '1-3',
    '0-4': '2-3',
    '0-5': '3-3',
    '0-6': '2',
    '0-7': '1',
    '0-8': '0',
    '0-9': '1-3',
    '0-10': '1-2',
    '0-11': '1-1',
    '1-3': '1-2',
    '1-4': '2-2',
    '1-5': '2-3',
    '1-6': '1',
    '1-7': '0',
    '1-8': '1',
    '1-9': '2-3',
    '1-10': '2-2',
    '1-11': '1-2',
    '2-3': '1-1',
    '2-4': '1-2',
    '2-5': '1-3',
    '2-6': '0',
    '2-7': '1',
    '2-8': '2',
    '2-9': '3-3',
    '2-10': '2-3',
    '2-11': '1-3',
    '3-6': '1-3',
    '3-7': '2-3',
    '3-8': '3-3',
    '3-9': '2',
    '3-10': '1',
    '3-11': '0',
    '4-6': '1-2',
    '4-7': '2-2',
    '4-8': '2-3',
    '4-9': '1',
    '4-10': '0',
    '4-11': '1',
    '5-6': '1-1',
    '5-7': '1-2',
    '5-8': '1-3',
    '5-9': '0',
    '5-10': '1',
    '5-11': '2',
    '6-9': '1-3',
    '6-10': '2-3',
    '6-11': '3-3',
    '7-9': '1-2',
    '7-10': '2-2',
    '7-11': '3-3',
    '8-9': '1-1',
    '8-10': '1-2',
    '8-11': '1-3'
}
