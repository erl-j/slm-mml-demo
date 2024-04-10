import { useState, useRef } from 'react'
import './App.css'
import MIDIPlayer from './MIDIPlayer'

const App = ({}) => {
  // const [count, setCount] = useState(0)

  const index = 90;

  const task = "generate"

  const natural_example = {
    "path": `public/artefacts/eval_cropped_midi/fad_test/natural/nr_${index}_cropped.mid`,
  }

  const mlm_example = {
    "path": `public/artefacts/eval_cropped_midi/fad_test/${task}/_mlm_t=1.0/nr_${index}_cropped.mid`,
  }
  const slm_example = {
    "path": `public/artefacts/eval_cropped_midi/fad_test/${task}/_slm_t=1.0/nr_${index}_cropped.mid`,
  }
  const examples = [natural_example,mlm_example, slm_example]

  const [currentFile, setCurrentFile] = useState(null)

  return (
    <div style={{display:"flex", flexDirection:"row", border:"1px solid black", width:"100%"}}>
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
          {/* <h3>{ex.path}</h3> */}
          <MIDIPlayer
            src={ex.path}
            isPlaying={currentFile === ex.path}
          />
        </div>
      )}
    </div>
  )


}

export default App
