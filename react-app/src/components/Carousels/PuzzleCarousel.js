import { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { ListableBoxAndLetters } from "../WordGon/WordGonBox";
import { color_dict, puzzleDifficulty } from "../../utils/puzzleFunctions";
import { parseDate } from "./PuzzlesOfTheDay";
import { DetailsByStatus } from "../WordGon/WordGonBox";

export default function PuzzleCarousel({ puzzles }) {
    const history = useHistory();
    const carouselRef = useRef();

    // set card width for clean intevals
    const cardWidth = 216;

    // scrollPlace can be 'start', 'end', or '', used to toggle inactivity
    const [scrollPlace, setScrollPlace] = useState('start')

    function scrollLeftEvent(e) {
        let nextIncr = carouselRef.current.scrollLeft - 3 * cardWidth - (carouselRef.current.scrollLeft % cardWidth)
        carouselRef.current.scroll(nextIncr, 0)
        if (nextIncr <= 0) {
            setScrollPlace('start')
        } else {
            setScrollPlace('')
        }
    }

    function scrollRightEvent(e) {
        let nextIncr = carouselRef.current.scrollLeft + 3 * cardWidth - (carouselRef.current.scrollLeft % cardWidth)
        carouselRef.current.scroll(nextIncr, 0)
        if (nextIncr >= carouselRef.current.scrollWidth - 5 * cardWidth) {
            setScrollPlace('end')
        } else {
            setScrollPlace('')
        }
    }

    return <div className="carousel-container">
        <div className="carousel" ref={carouselRef}>
            {puzzles.map(puzzle => <div className='puzzle-card' key={`carousel-card-${puzzle.id}`} onClick={() => history.push(`/wordgons/${puzzle.id}`)} >
                <div className='puzzle-title' style={{ backgroundColor: color_dict[puzzleDifficulty(puzzle)] }}>
                    <span style={{ margin: '5px 0' }}>{puzzle.puzzleDay !== 'None' ? parseDate(puzzle.puzzleDay) : 'Word-Gon #' + puzzle.id}</span>
                </div>
                <div style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <ListableBoxAndLetters letters={puzzle.letters} puzzleId={puzzle.id} difficulty={puzzleDifficulty(puzzle)} />
                    <DetailsByStatus puzzleId={puzzle.id} />
                </div>
            </div>)}
        </div>
        <div className={"scroll-button left" + (scrollPlace === 'start' ? ' inactive' : '')} onClick={scrollLeftEvent}><i className="fas fa-caret-left" /></div>
        <div className={"scroll-button right" + (scrollPlace === 'end' ? ' inactive' : '')} onClick={scrollRightEvent}><i className="fas fa-caret-right" /></div>
    </div>
}
