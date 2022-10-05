import { letterIndexToCoord as lettersObj } from "../../utils/lineFunctions";

export default function LetterLine({ twoIndices, backgroundColor }) {

    const coordsStart = lettersObj[twoIndices[0]];
    const coordsEnd = lettersObj[twoIndices[1]];
    const x = coordsStart[0];
    const y = coordsStart[1];
    const xEnd = coordsEnd[0];
    const yEnd = coordsEnd[1];


    const angle = Math.atan((yEnd - y) / (xEnd - x)) + (xEnd >= x ? 0 : Math.PI);

    const style = {
        top: y + 'em',
        left: x + 'em',
        rotate: angle + 'rad',
        backgroundColor: backgroundColor
    }

    return <div className="letter-line" style={style} />
}
