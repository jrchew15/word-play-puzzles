import PuzzlesByDifficulty from "./components/Carousels/PuzzlesByDifficulty";
import PuzzlesOfTheDay from "./components/Carousels/PuzzlesOfTheDay";
import { useState } from "react";

export default function Homepage() {
    const [loaded1, setLoaded1] = useState(false)
    const [loaded2, setLoaded2] = useState(false)
    const [loaded3, setLoaded3] = useState(false)
    const [loaded4, setLoaded4] = useState(false)

    const allLoaded = loaded1 && loaded2 && loaded3 && loaded4

    return <div style={allLoaded ? {} : { display: 'none' }}>
        <PuzzlesOfTheDay loaded={loaded1} setLoaded={setLoaded1} />
        <PuzzlesByDifficulty difficulty={'easy'} loaded={loaded2} setLoaded={setLoaded2} />
        <PuzzlesByDifficulty difficulty={'medium'} loaded={loaded3} setLoaded={setLoaded3} />
        <PuzzlesByDifficulty difficulty={'hard'} loaded={loaded4} setLoaded={setLoaded4} />
    </div>
}
