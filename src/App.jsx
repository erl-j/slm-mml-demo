import { useState, useRef, useEffect } from 'react'
import './App.css'
import MIDIPlayer from './MIDIPlayer'

const App = ({ }) => {
  // const [count, setCount] = useState(0)

  const n_samples = 100;

  const tasks = [
    // "infilling_high", 
    "infilling_start", 
    "infilling_end", 
    "infilling_low", 

    "infilling_high_patched",
    "pitch_set",
    // "pitch_onset_set",
    // "onset_set",
    // "infilling_box_end",
    "infilling_box_middle",
    // "infilling_drums",
    // "infilling_harmonic",
    "constrained_generation", 

    "generate", 
  ]
  const temperatures = ["0.85", "0.9","0.95", "1.0"]
  const [index, setIndex] = useState(0)
  const [task, setTask] = useState("infilling_high")
  const [temperature, setTemperature] = useState("1.0")


  const natural_example = {
    "path": `artefacts/eval_cropped_midi/fad_test_sane/natural/nr_${index}_cropped.mid`,
  }

  const mlm_example = {
    "path": 'artefacts/eval_cropped_midi/fad_test_sane/' + task + '/' + 'mlm_t=' + temperature + '/nr_' + index + '_cropped.mid',
  }
  const slm_example = {
    "path": 'artefacts/eval_cropped_midi/fad_test_sane/' + task + '/' + 'slm_t=' + temperature + '/nr_' + index + '_cropped.mid',
  }
  const examples = [natural_example, mlm_example, slm_example]

  const [currentFile, setCurrentFile] = useState(null)

  // use effect that when something changes, it sets current file to null
  useEffect(() => {
    // stop all audio on this page
    setCurrentFile(null)
  }, [task, temperature, index])

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
