import { useRef } from "react";
import { useHistory } from "react-router-dom";
import { ListableBoxAndLetters } from "../WordGon/WordGonBox";
import { color_dict, puzzleDifficulty } from "../../utils/puzzleFunctions";
import { parseDate } from "./PuzzlesOfTheDay";
import { DetailsByStatus } from "../WordGon/WordGonBox";

export default function PuzzleCarousel({ puzzles }) {
    const history = useHistory();
    const carouselRef = useRef();

    function scrollLeftEvent(e) {
        carouselRef.current.scroll(carouselRef.current.scrollLeft - 500, 0)
    }

    function scrollRightEvent(e) {
        carouselRef.current.scroll(carouselRef.current.scrollLeft + 500, 0)
        // console.log(puzzles[0].puzzleDay)
    }

    return <div className="carousel-container">
        <div className="carousel" ref={carouselRef}>
            {puzzles.map(puzzle => <div className='puzzle-card' onClick={() => history.push(`/wordgons/${puzzle.id}`)} >
                <div className='puzzle-title' style={{ backgroundColor: color_dict[puzzleDifficulty(puzzle)] }}>
                    <span style={{ margin: '5px 0' }}>{puzzle.puzzleDay !== 'None' ? parseDate(puzzle.puzzleDay) : 'Word-Gon #' + puzzle.id}</span>
                </div>
                <div style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <ListableBoxAndLetters letters={puzzle.letters} puzzleId={puzzle.id} difficulty={puzzleDifficulty(puzzle)} />
                    <DetailsByStatus puzzleId={puzzle.id} />
                </div>
            </div>)}
        </div>
        <div className="scroll-button left" onClick={scrollLeftEvent}><i className="fas fa-caret-left" /></div>
        <div className="scroll-button right" onClick={scrollRightEvent}><i className="fas fa-caret-right" /></div>
    </div>
}
