import { useState, useRef, useEffect } from 'react'
import 'html-midi-player'
import "./Midi.css"


const MIDIPlayer = ({src,isPlaying}) => {

    // use ref 
    const visualizerRef = useRef(null);
    const playerRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        if (isPlaying) {
            if (playerRef.current) {
                playerRef.current.stop(); // Stop the player before removing it
                containerRef.current.removeChild(playerRef.current);
                playerRef.current = null; // Reset playerRef
            }
            // create midi player
            playerRef.current = document.createElement('midi-player');
            containerRef.current.appendChild(playerRef.current);
            playerRef.current.soundFont = "https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus";

            playerRef.current.src = src;
            playerRef.current.loop = true;
            playerRef.current.addVisualizer(visualizerRef.current);
            // document.getElementById("midiPlayer").src = "generated.mid";
            playerRef.current.addEventListener('load', () => {
                console.log("loaded");
                // playerRef.current.reload();
                playerRef.current.start();
            }
            )
        }
        if (!isPlaying) {
            if (playerRef.current) {
                playerRef.current.stop(); // Stop the player before removing it
                containerRef.current.removeChild(playerRef.current);
                playerRef.current = null; // Reset playerRef
            }
        }
    }, [isPlaying])


    return (
        <div style={{
            border:"1px solid black"
        }}>
                <midi-visualizer
                    src={src}
                    ref={visualizerRef}
                ></midi-visualizer>
            <div ref={containerRef} style={{height:"4em",width:"100%"}}>
            </div>
        </div>
    )

}

export default MIDIPlayer
