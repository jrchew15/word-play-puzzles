export function BoxAndLetters({ letters }) {
    let letterClasses = ['u1', 'u2', 'u3', 'r1', 'r2', 'r3', 'd1', 'd2', 'd3', 'l1', 'l2', 'l3'];

    return (
        <>
            <div id='puzzle-container'>
                {letters.split('').map((x, idx) => (
                    <span className={letterClasses[idx] + ' letter'} key={idx}>{x.toUpperCase()}</span>
                ))}
                {letterClasses.map((x, idx) => (
                    <div className={x + ' circle'} key={idx} />
                ))}
            </div>
            <div id='puzzle-square' />
            <div id='a-to-o' />
        </>
    )
}
