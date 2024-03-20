import { useState, useRef } from 'react'
import './App.css'
import MIDIPlayer from './MIDIPlayer'
import examples from './examples'

const App = () => {
  // const [count, setCount] = useState(0)
  console.log(examples)

  const [currentFile, setCurrentFile] = useState(null)

  return (
    <div>
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
          <h3>{ex.path}</h3>
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
