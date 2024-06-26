import { useState, useRef, useEffect } from 'react'
import './App.css'
import MIDIPlayer from './MIDIPlayer'

const App = ({ }) => {
  // const [count, setCount] = useState(0)

  const n_samples = 100;

  const taskMeta = {
    "generate": {
      "title": "Unconstrained generation",
      "description": "Generate a loop from scratch.",
      "temperature": "0.85",
      "parameters": "top-p=0.75, T=200."
    },
    "pitch_set": {
      "title": "Replace pitch",
      "description": "Regenerate all the pitches of the loop, restricting the pitches to the set of pitches in the natural reference loop.",
      "parameters": "top-p=0.85, T=300."
    },
    "constrained_generation": {
      "title": "Constrained generation",
      "description": "We restrict the generation to only use instruments and note onset beats present in the natural reference loop.",
      "temperature": "0.85",
      "parameters": "top-p=0.99, T=300."
    },
    "variation": {
      "title": "Variation",
      "description": "Generate a variation of the loop. We do this by taking our source loop, turning it into a one-hot-like probability distribution, and mixing it with a uniform prior.",

      "parameters": "top-p=0.75, T=300."
    },
    "infilling_high_patched": {
      "title": "Replace upper half",
      "description": "Regenerate the upper half of the natural reference loop's pitch range, drums are kept the same.",
      "parameters": "top-p=0.75, T=300."
    },
    "infilling_low": {
      "title": "Replace lower half",
      "description": "Regenerate the lower half of the natural reference loop's pitch range, drums are kept the same.",
      "parameters": "top-p=0.5, T=200."
    },
    "infilling_box_middle": {
      "title": "Replace box",
      "description": "Regenerate upper half of the natural reference loop's pitch range for bars 2 and 3, drums are kept the same.",
      "parameters": "top-p=0.75, T=300."
    },
    "infilling_middle": {
      "title": "Infill middle",
      "description": "Regenerate bars 2 and 3 of the natural reference loop.",
      "parameters": "top-p=0.75, T=300."
    },
    "replace_bass": {
      "title": "Replace bass",
      "description": "Replace the bass of the loop.",
      "parameters": "top-p=0.75, T=300."
    },
    "infilling_drums": {
      "title": "Replace drums",
      "description": "Replace the drums of the loop.",
      "parameters": "top-p=0.75, T=300."
    },
    "infilling_start": {
      "title": "Replace first half",
      "description": "Regenerate the first half of the loop.",
      "parameters": "top-p=0.75, T=300."
    },
    "infilling_end": {
      "title": "Replace second half",
      "description": "Regenerate the second half of the loop.",
      "parameters": "top-p=0.75, T=300."
    },
  }

  const tasks = [
    "generate",
    "constrained_generation",
    "infilling_start",
    "infilling_end",
    "infilling_low",
    "infilling_high_patched",
    "infilling_box_middle",
    "pitch_set",
    // "infilling_high_patched",
    // "pitch_onset_set",
    // "onset_set",
    // // "infilling_box_end",
    // "infilling_drums",
    // "infilling_harmonic",

  ]

  // print tasks with missing metadata
  console.log(tasks.filter(t => !taskMeta[t]))
  // const temperatures = ["0.85", "0.9","0.95", "1.0"]
  const [index, setIndex] = useState(0)
  const [task, setTask] = useState("generate")
  // const [temperature, setTemperature] = useState("1.0")

  const temperature = taskMeta[task].temperature ?? "1.0";


  const natural_example = {
    "path": `artefacts/eval_cropped_midi/fad_test_sane/natural/nr_${index}_cropped.mid`,
  }

  const mlm_example = {
    "path": 'artefacts/eval_cropped_midi/fad_test_sane/' + task + '/' + 'mlm_t=' + temperature + '/nr_' + index + '_cropped.mid',
  }
  const slm_example = {
    "path": 'artefacts/eval_cropped_midi/fad_test_sane/' + task + '/' + 'slm_t=' + temperature + '/nr_' + index + '_cropped.mid',
  }
  const examples = task == "generate" ? [slm_example, mlm_example] : [natural_example, slm_example, mlm_example]

  const [currentFile, setCurrentFile] = useState(null)

  // use effect that when something changes, it sets current file to null
  useEffect(() => {
    // stop all audio on this page
    setCurrentFile(null)
  }, [task, temperature, index])

  const linkTo = (task, index) => {
    return <span
    style={{color: "blue", cursor: "pointer",
    textDecoration: "underline"
    }}
    onClick={() => {
      setTask(task)
      setIndex(index)
    }}
    >{index}</span>
  }

  return (
    <div style={{ width: "100vw" }}>
      <h1>Demo for Steer-by-Prior Editing of Symbolic Music Loops</h1>
      <h2>Video demo</h2>
      <iframe width="560" height="315" src="https://www.youtube.com/embed/etuF94r-3hM?si=xdDlTvufmzFId278" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>

      <br></br>
      <p>
      This video demonstrates how the SLM can be used to enable various editing tasks in an interactive application.

      Each action is executed by calling an API which generates a prior based on the selected action, the current loop and predefined rules and then iteratively samples the unknown tokens with the SLM.
      </p>

      <h2>Editing tasks examples</h2>
      <p>
        This page shows examples generated from a Superposed Language Model (SLM) across several loop generation and editing tasks.
        <br />
        In addition to our proposed Superposed Language Model (SLM), we also provide examples generated with a Masked Language Model (MLM) with restricted sampling for comparison.
        <br />
        We have not cherry picked the examples. All examples were generated with a seed of 0. The natural loops were randomly selected from the test set.
        {/* The inference parameters top-p and T were set on a task by task basis and are displayed below the task descriptions.
        For each task, the examples were generated in one batch using a fixed random seed. */}
      </p>
      <p>
        <b> Website Instructions</b>
        <br />
        Play audio by clicking on a piano roll. Stop the audio by clicking the active piano roll again.
        <br />
        Note that the colours used to indicate the instruments are not consistent across loops.
        <br />
        This website was tested on Chrome (Version 124.0.6367.78).
      </p>

      <div>
        <div>


          <div>
          </div>
          <div>
            <h3>Tasks:</h3>
            {tasks.map((t) =>
              <button
                key={t}
                style={{
                  backgroundColor: t === task ? "lightblue" : "white",
                  "margin": "2px",
                  "padding": "4px",
                  "height": "40px",

                }}
                onClick={() => setTask(t)}>{
                  taskMeta[t].title
                }</button>
            )}
            <div>

              <p><b>Task description: </b>{taskMeta[task].description}</p>
              {/* <p><b>Parameters used: </b>{taskMeta[task].parameters}</p> */}

            </div>
          </div>
        </div>
        <div>
          Temperature used: {
            temperature
          }
          {/* {temperatures.map((t) =>
            <button
              key={t}
              style={t === temperature ? { backgroundColor: "lightblue" } : { backgroundColor: "white" }}
              onClick={() => setTemperature(t)}>{t}</button>
          )} */}
        </div>

        <h3>Sample nr {index}/{n_samples}</h3>
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
      <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-evenly" }}>


        {examples.map((ex, i) =>
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
              style={{ fontSize: "20px" }}
            >{
                ex.path.includes("mlm_t=") ? "MLM w/ restricted sampling" : ex.path.includes("slm_t=") ? "SLM" : "Natural reference"
              }</span>
            <MIDIPlayer
              src={ex.path}
              isPlaying={currentFile === ex.path}
            />
          </div>
        )}
      </div>
      <div>
        
      </div>
      
    </div>

  )


}

export default App
