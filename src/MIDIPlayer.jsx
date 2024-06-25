import { useState, useRef, useEffect } from 'react'
import 'html-midi-player'
import "./Midi.css"


const MIDIPlayer = ({src,isPlaying}) => {

    // use ref 
    const visualizerRef = useRef(null);
    const playerRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        visualizerRef.current.config = {
            noteHeight: 4,
            pixelsPerTimeStep: 30,
            minPitch: 24,
            maxPitch: 96,
        };
    }, [visualizerRef.current])

    useEffect(() => {
        if (isPlaying) {

            // var frames = window.frames;
            // console.log("frames", frames);
            // for (var i = 0; i < frames.length; i++) {
            //     var sounds = frames[i].document.getElementsByTagName('midi-player');
            //     console.log("sounds", sounds);
            //     for (j = 0; j < sounds.length; j++) {
            //         sounds[j].stop();
            //         // remove the player
            //         sounds[j].parentNode.removeChild(sounds[j]);
            //     }
            // }
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
            playerRef.current.loop = false;
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
        }}>
                <midi-visualizer
                style={{
                    border: "1px solid black"

                }}
                    src={src}
                    ref={visualizerRef}
                ></midi-visualizer>
            <div ref={containerRef} style={{display:"none"}}>
            </div>
        </div>
    )

}

export default MIDIPlayer
