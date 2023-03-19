import './loader-animation.css'

// displays after user input until guess animation begins
export default function WordleLoader() {
    return <div id='wordle-loader'>
        <div className='dot load1' />
        <div className='dot load2' />
        <div className='dot load3' />
    </div>
}
