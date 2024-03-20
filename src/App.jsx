import { useState, useRef } from 'react'
import './App.css'
import MIDIPlayer from './MIDIPlayer'

const App = () => {
  // const [count, setCount] = useState(0)

  const files = ["generated.mid", "generated_dense.mid"]

  const [currentFile, setCurrentFile] = useState(null)

  return (
    <div>

      {files.map((file) =>
        <div key={file}
          onClick={() => {
            if (currentFile === file) {
              setCurrentFile(null)
            }
            else {
                setCurrentFile(file)
            }
        }}
        >
          <MIDIPlayer
            src={file}
            isPlaying={currentFile === file}
          />
        </div>
      )}
    </div>
  )


}

export default App
