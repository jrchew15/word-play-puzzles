import { letterIndexToCoord } from "../../utils/lineFunctions";

export default function LetterLine({ twoIndices, backgroundColor }) {

    const coordsStart = letterIndexToCoord[twoIndices[0]];
    const coordsEnd = letterIndexToCoord[twoIndices[1]];
    const x = coordsStart[0];
    const y = coordsStart[1];
    const xEnd = coordsEnd[0];
    const yEnd = coordsEnd[1];

    const length = Math.round(Math.sqrt((x - xEnd) ** 2 + (y - yEnd) ** 2))

    const angle = Math.atan((yEnd - y) / (xEnd - x)) + (xEnd >= x ? 0 : Math.PI);

    const style = {
        top: y + 'em',
        left: x + 'em',
        rotate: angle + 'rad',
        backgroundColor: backgroundColor,
        width: length + 'em'
    }

    return <div className="letter-line" style={style} />
}
