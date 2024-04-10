import { useState, useRef } from 'react'
import './App.css'
import MIDIPlayer from './MIDIPlayer'

const App = ({ }) => {
  // const [count, setCount] = useState(0)

  const n_samples = 100;

  const tasks = ["infilling_high", "infilling_low", "constrained_generation", "infilling_start", "infilling_end", "generate"]
  const temperatures = ["0.85", "0.9", "1.0"]
  const [index, setIndex] = useState(0)
  const [task, setTask] = useState("infilling_high")
  const [temperature, setTemperature] = useState("1.0")


  const natural_example = {
    "path": `public/artefacts/eval_cropped_midi/fad_test/natural/nr_${index}_cropped.mid`,
  }

  const mlm_example = {
    "path": `public/artefacts/eval_cropped_midi/fad_test/${task}/${task === "constrained_generation" ? "" : "_"}mlm_t=${temperature}/nr_${index}_cropped.mid`,
  }
  const slm_example = {
    "path": `public/artefacts/eval_cropped_midi/fad_test/${task}/${task === "constrained_generation" ? "" : "_"}slm_t=${temperature}/nr_${index}_cropped.mid`,
  }
  const examples = [natural_example, mlm_example, slm_example]

  const [currentFile, setCurrentFile] = useState(null)

  return (
    <div>
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
        </div>
        <div>
          <h3>Temperature:</h3>
          {temperatures.map((t) =>
            <button
              key={t}
              style={t === temperature ? { backgroundColor: "lightblue" } : { backgroundColor: "white" }}
              onClick={() => setTemperature(t)}>{t}</button>
          )}
        </div>

      </div>
      <div style={{ display: "flex", flexDirection: "row", border: "1px solid black", width: "100%" }}>


        {examples.map((ex) =>
          <div key={ex.path}
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
              style={{ fontSize: "2px" }}
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
