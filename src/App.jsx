import { useState, useRef, useEffect } from 'react'
import './App.css'
import MIDIPlayer from './MIDIPlayer'

const App = ({ }) => {
  // const [count, setCount] = useState(0)

  const n_samples = 5;

  const tasks = [
    // "constrained_generation",
    "infilling_middle",
    "infilling_high",
    "infilling_low",
    "infilling_box_middle",
    "replace_bass",
    "replace_drums",
    "pitch_set",
    "variation",
    "generate",
    "generate_w_constraints",
  ]

  const taskMeta = {
    "generate": {
      "title": "Unconditional generation",
      "description": "Generate a loop from scratch without any conditioning/constraints whatsoever. Note that example nr 1 contains no notes.",
      "parameters": "top-p=0.75, T=200 (Number of forward passes)"
    },
    "generate_w_constraints": {
      "title": "Conditional generation",
      "description": "Generate a loop with constraints. The constraint used here consists of restricting pitch to the C major pitch-set, using only drums, piano, guitar, bass with at least 10 notes per instrument, and between 50 and 250 notes in total.",

      "parameters": "top-p=0.99, T=300 (Number of forward passes)"
    },
    "variation": {
      "title": "Variation",
      "description": "Generate a variation of the loop. We do this by taking our source loop, turning it into a one-hot-like probability distribution, and mixing it with a uniform prior.",

      "parameters": "top-p=0.75, T=300 (Number of forward passes)"
    },
    "infilling_high": {
      "title": "Infill upper half",
      "description": "Regenerate the upper half of the loop's pitch range, drums are kept the same.",
      "parameters": "top-p=0.75, T=300 (Number of forward passes)"
    },
    "infilling_low": {
      "title": "Infill lower half",
      "description": "Regenerate the lower half of the loop's pitch range, drums are kept the same.",
      "parameters": "top-p=0.5, T=200 (Number of forward passes)"
    },
    "infilling_box_middle": {
      "title": "Infill middle box",
      "description": "Regenerate upper and lower half of the loop's pitch range for bars 2 and 3, drums are kept the same.",
      "parameters": "top-p=0.75, T=300 (Number of forward passes)"
    },
    "infilling_middle": {
      "title": "Infill middle",
      "description": "Regenerate bars 2 and 3 of the loop.",
      "parameters": "top-p=0.75, T=300 (Number of forward passes)"
    },
    "replace_bass": {
      "title": "Replace bass",
      "description": "Replace the bass of the loop.",
      "parameters": "top-p=0.75, T=300 (Number of forward passes)"
    },
    "replace_drums": {
      "title": "Replace drums",
      "description": "Replace the drums of the loop.",
      "parameters": "top-p=0.75, T=300 (Number of forward passes)"
    },
    "pitch_set": {
      "title": "Replace pitch",
      "description": "Regenerate all the pitches of the loop. In these examples, the pitches are restricted to the set of pitches in the source loop.",
      "parameters": "top-p=0.85, T=300 (Number of forward passes)"
    },
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
    <div style={{ width: "100vw", margin: 16 }}>
      <h3> Demo for ICCC Short Paper Submission 172: SYMPLEX: Fast, Flexible and Controllable Symbolic Music Generation using
        Simplex Diffusion</h3>
      <p>This website was tested on Chrome (Version 124.0.6367.78).
        <br />
        Play audio by clicking on a piano roll. Stop the audio by clicking the active piano roll again.
        <br />
        Note that the colours used to indicate the instruments are not consistent across loops.
        <br />
        The inference parameters top-p and T were set on a task by task basis and are displayed below the task descriptions.
        For each task, the examples were generated in one batch using a fixed random seed.
      </p>

      <div>

        <div>
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
            
            <p><b>Task description: </b>{taskMeta[task].description}</p>
            <p>Parameters used: {taskMeta[task].parameters}</p>

          </div>
          <div>
            <h4>Example nr {index}/{n_samples}:</h4>

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
            <h3>{ex.path.includes("natural") ? "Source loop" : "Generation result"}</h3>
            <span
              style={{ color: "white" }}
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
