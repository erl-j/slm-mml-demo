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

  // const modelsAvailable = [
  //   "hz_512_",
  //   "hz_768_"
  // ]

  const samples = []


  const stepsAvailable = [5, 10, 25, 50, 100, 200]

  const [index, setIndex] = useState(0)
  const [task, setTask] = useState("infilling_middle")
  // const [temperature, setTemperature] = useState("0.9")

  const natural_example = {
    "path": `simplex_demo_2_website_pp/natural/nr_${index}.mid`,
  }

  const simplex_example = {
    "path": `simplex_demo_2_website_pp/${task}/nr_${index}.mid`,
  }


  const examples = [natural_example, simplex_example]

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
      <p>This website was tested on Chrome (Version 124.0.6367.78)</p>

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
                onClick={() => setTask(t)}>{t}</button>
            )}
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
