import { useState, useRef } from 'react'
import './App.css'
import MIDIPlayer from './MIDIPlayer'

const App = ({examples}) => {
  // const [count, setCount] = useState(0)

  const [currentFile, setCurrentFile] = useState(null)

  return (
    <div style={{"height":"100%","width":"100%",display:"flex", flexDirection:"column", border:"1px solid black"}}>
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
