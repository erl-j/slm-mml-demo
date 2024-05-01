import { useState, useRef, useEffect } from 'react'
import './App.css'
import MIDIPlayer from './MIDIPlayer'

const App = ({ }) => {
  // const [count, setCount] = useState(0)

  const n_samples = 10;

  const tasks = [
    "generate",
    // "constrained_generation",
    "variation",    
    "infilling_start",
    "infilling_end",
    "infilling_high",
    "infilling_low",
    // "infilling_box_middle",
    "infilling_harmonic",
    "infilling_drums",
    "onset_offset_set",
    "pitch_onset_offset_set",
    "pitch_set",
  ]

  const modelsAvailable = [
    "hz_512_",
    "hz_768_"
  ]

  const samples = []


  const stepsAvailable = [5,10,25,50,100,200]
  const toppAvailable = ["0.0","0.5", "0.8","0.9","0.95","0.99","1.0"]

  const [model, setModel] = useState("hz_768_")
  const [index, setIndex] = useState(0)
  const [task, setTask] = useState("infilling_end")
  const [steps, setSteps] = useState(200)
  const [topp, setTopp] = useState("1.0")
  // const [temperature, setTemperature] = useState("0.9")

  let task_suffix = ".."
  if (task.includes("infilling") || task.includes("_set")){
    task_suffix = `${model}steps_${steps}_topp_${topp}_prior_1.0_enforce_True`
  }
  if (task.includes("generate")) {
    task_suffix = `${model}steps_${steps}_topp_${topp}_prior_1.0_enforce_True`
  }
  if (task.includes("constrained_generation")) {
    task_suffix = `${model}steps_${steps}_topp_${topp}_prior_1.0_enforce_True`
  }
  if (task.includes("variation")) {
    task_suffix = `${model}steps_${steps}_topp_${topp}_prior_0.75_enforce_False`
  }

  const natural_example = {
    "path": `simplex_demo/natural/nr_${index}.mid`,
  }

  const simplex_example = {
    "path": `simplex_demo/${task}/${task_suffix}/nr_${index}.mid`,
  }


  const examples = [natural_example, simplex_example]

  const [currentFile, setCurrentFile] = useState(null)


  // use effect that when something changes, it sets current file to null
  useEffect(() => {
    // stop all audio on this page
    setCurrentFile(null)
  }, [task, index])

  return (
    <div style={{ width: "100vw" }}>
      <h1>Sample nr {index}/{n_samples}</h1>
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

          <div>
            
            <h3>Steps:</h3>
            {stepsAvailable.map((s) =>
              <button
                key={s}
                style={s === steps ? { backgroundColor: "lightblue" } : { backgroundColor: "white" }}
                onClick={() => setSteps(s)}>{s}</button>
            )}
          </div>
          <div>
            <h3>Top-p:</h3>
            {toppAvailable.map((t) =>
              <button
                key={t}
                style={t === topp ? { backgroundColor: "lightblue" } : { backgroundColor: "white" }}
                onClick={() => setTopp(t)}>{t}</button>
            )}
          </div>

          <div>
            <h3>Model:</h3>
            {modelsAvailable.map((m) =>
              <button
                key={m}
                style={m === model ? { backgroundColor: "lightblue" } : { backgroundColor: "white" }}
                onClick={() => setModel(m)}>{m}</button>
            )}
          </div>

        </div>
        <div>
      
        </div>

      </div>
      <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent:"space-evenly" }}>


        {examples.map((ex) =>
          <div key={ex.path}
          style={{flex:1,margin:"4px"}}
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
              style={{ fontSize: "12px" }}
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
