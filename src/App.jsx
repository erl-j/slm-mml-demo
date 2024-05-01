import { useState, useRef, useEffect } from 'react'
import './App.css'
import MIDIPlayer from './MIDIPlayer'

const App = ({ }) => {
  // const [count, setCount] = useState(0)

  const n_samples = 5;

  const tasks = [
    "generate",
    "generate_w_constraints",
    // "constrained_generation",
    "variation",
    "infilling_high",
    "infilling_low",
    "infilling_box_middle",
    "infilling_middle",
    "replace_bass",
    "replace_drums",
    "pitch_set",
  ]

  const taskMeta = {
    "generate": {"title": "Unconditional generation", "description": "Generate a loop from scratch."},
    "generate_w_constraints": {"title": "Conditional generation", "description": "Generate a loop with constraints. The constraint used here is that we want to restrict pitch to the C major pitch-set, using only Drums, Piano, Guitar, Bass with at least 10 notes per instrument, and between 50 and 250 notes in total."},
    "variation": {"title": "Variation", "description": "Generate a variation of the loop. We do this by taking our source loop, turning into a probability distribution, and mixing it with a uniform prior."},
    "infilling_high": {"title": "Infill upper half", "description": "Regenerate the upper half of the loop's pitch range, drums are kept the same."},
    "infilling_low": {"title": "Infill lower half", "description": "Regenerate the lower half of the loop's pitch range, drums are kept the same."},
    "infilling_box_middle": {"title": "Infill middle box", "description": "Regenerate upper and lower half of the loop's pitch range for bars 8 to 12, drums are kept the same."},
    "infilling_middle": {"title": "Infill middle", "description": "Regenerate everything bars 8 to 12 of the loop."},
    "replace_bass": {"title": "Replace bass", "description": "Replace the bass of the loop"},
    "replace_drums": {"title": "Replace drums", "description": "Replace the drums of the loop"},
    "pitch_set": {"title": "Pitch set", "description": "Regenerate all the pitches of the loop. In these examples, the pitches are restricted to the set of pitches in the source loop."}
  }

  // const modelsAvailable = [
  //   "hz_512_",
  //   "hz_768_"
  // ]


  const [index, setIndex] = useState(0)
  const [task, setTask] = useState("infilling_middle")
  // const [temperature, setTemperature] = useState("0.9")

  const natural_example = {
    "path": `simplex_demo_2_website_pp/natural/nr_${index}.mid`,
  }

  const simplex_example = {
    "path": `simplex_demo_2_website_pp/${task}/nr_${index}.mid`,
  }

  let examples = []
  if (task === "generate" || task === "generate_w_constraints") {
    examples = [simplex_example]

  }
  else {
    examples = [natural_example, simplex_example]
  }


  const [currentFile, setCurrentFile] = useState(null)


  // use effect that when something changes, it sets current file to null
  useEffect(() => {
    // stop all audio on this page
    setCurrentFile(null)
  }, [task, index])

  return (
    <div style={{ width: "100vw", margin:16 }}>
      <h1> SYMPLEX: Fast, Flexible and Controllable Symbolic Music Generation using
        Simplex Diffusion</h1>
      <h2>Demo for ICCC Short Paper Submission</h2> 
      <p>This website was tested on Chrome (Version 124.0.6367.78).
        Note that the colours used to indicate the instruments are not consistent across loops.
      </p>

      <h3>Example nr {index}/{n_samples}</h3>
      <div>

        <div>
          <button onClick={() => setIndex(
            // mod n_samples
            (index - 1 + n_samples) % n_samples
          )}>previous sample</button>
          <button
            onClick={() => setIndex(
              // mod n_samples
              (index + 1) % n_samples

            )}>next sample</button>
          <button
            onClick={() => {
              const random = Math.floor(Math.random() * n_samples - 1)
              // mod n_samples
              setIndex((random + index + 1) % n_samples)
            }
            }>random sample</button>
          <div>
          </div>
          <div>
            <h3>Task:</h3>
            {tasks.map((t) =>
              <button
                key={t}
                style={t === task ? { backgroundColor: "lightblue" } : { backgroundColor: "white" }}
                onClick={() => setTask(t)}>{
                  taskMeta[t].title
                }</button>
            )}
          </div>
          <div>
            <h3>Task description:</h3>
            <p>{taskMeta[task].description}</p>
          </div>

         
        </div>
        <div>

        </div>

      </div>
      <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-evenly" }}>


        {examples.map((ex) =>
          <div key={ex.path}
            style={{ flex: 1, margin: "4px" }}
            onClick={() => {
              if (currentFile === ex.path) {
                setCurrentFile(null)
              }
              else {
                setCurrentFile(ex.path)
              }
            }}
          > 
          <h2>{ex.path.includes("natural") ? "Source loop" : "Generation result"}</h2>
            <span
              style={{ color:"white" }}
            >{ex.path}</span>
            <MIDIPlayer
              src={ex.path}
              isPlaying={currentFile === ex.path}
            />
          </div>
        )}
      </div>
    </div>

  )


}

export default App
