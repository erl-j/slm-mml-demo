import { useState, useEffect } from 'react'
import './App.css'
import MIDIPlayer from './MIDIPlayer'
import { codePriors, tasks, taskMeta } from './constants'

const App = () => {
  const n_samples = 100;

  const [prior, setPrior] = useState(Object.keys(codePriors)[0])
  const [index, setIndex] = useState(0)
  const [task, setTask] = useState("generate")
  const [currentFile, setCurrentFile] = useState(null)

  const temperature = taskMeta[task].temperature ?? "1.0";

  const natural_example = {
    "path": `artefacts/eval_cropped_midi/fad_test_sane/natural/nr_${index}_cropped.mid`,
  }

  const mlm_example = {
    "path": `artefacts/eval_cropped_midi/fad_test_sane/${task}/mlm_t=${temperature}/nr_${index}_cropped.mid`,
  }

  const slm_example = {
    "path": `artefacts/eval_cropped_midi/fad_test_sane/${task}/slm_t=${temperature}/nr_${index}_cropped.mid`,
  }

  const examples = task === "generate" ? [slm_example, mlm_example] : [natural_example, slm_example, mlm_example]

  useEffect(() => {
    setCurrentFile(null)
  }, [task, temperature, index])

  return (
    <div
      className='app-container'
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        boxSizing: 'border-box',
      }}>
      <h1 style={{ textAlign: 'center' }}>Demo for MML' 24 workshop: "Steer-by-Prior Editing of Symbolic Music Loops"</h1>
      <h2>Nicolas Jonason, Luca Casini and Bob L. T. Sturm</h2>
      <h3>KTH Royal Institute of Technology, Stockholm, Sweden</h3>

      Welcome to the supplementary material for our paper "Steer-by-Prior Editing of Symbolic Music Loops".
      <h2>A) Demo video</h2>
      <div style={{ width: '100%', aspectRatio: '16 / 9', marginBottom: '20px' }}>
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/mCdI9-re40A?si=d5FqrwNLQALaS4B7"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>

      <p style={{ textAlign: 'justify', width: '100%' }}>
        This video demonstrates how the SLM can be used to enable various editing tasks in an interactive application.
        Each action is executed by calling an API which generates a prior based on the selected action, the current loop and predefined rules and then iteratively samples the unknown tokens with the SLM.
        <br></br>
        Below we give some pseudocode examples of the server-side implementation of the API.
      </p>

      <div style={{ width: '100%' }}>
      <h3>Pseucode code for tasks</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        {Object.keys(codePriors).map((p) => (
          <button
            key={p}
            style={{
              backgroundColor: p === prior ? 'lightblue' : 'white',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={() => setPrior(p)}
          >
            "{p}"
          </button>
        ))}
      </div>
      </div>
      
      <div style={{
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        width: '100%'
      }}>
        <h4 style={{
          color: '#2c3e50',
          marginTop: '0',
          marginBottom: '10px',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          {prior}
        </h4>
        <p style={{ textAlign: 'justify', width: '100%' }}>
          {codePriors[prior].caption}
        </p>
        <p style={{
          color: 'lightgray',
          marginBottom: '10px',
          lineHeight: '1.6',
          fontSize: '16px'
        }}>
          <div style={{
            width: '100%',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <pre style={{
              maxWidth: '100%',
              overflowX: 'scroll',
              background: '#0d0d8d',
              padding: '10px',
              borderRadius: '5px',
              textAlign: 'left' // Ensure code alignment is maintained
            }}>
              <code>
                {codePriors[prior].code}
              </code>
            </pre>
          </div>
        </p>
      </div>

     

      <hr style={{ width: '100%', margin: '20px 0' }} />
      <h2>B) Example outputs</h2>
      <p style={{ textAlign: 'justify', width: '100%' }}>
        We now present some examples generated from our Superposed Language Model (SLM) across several basic loop generation and editing tasks.
        In addition to the SLM outputs, we also provide examples generated with a Masked Language Model (MLM) with restricted sampling for comparison.
        <br></br>
        We have not cherry picked the examples.  The natural reference loops were randomly selected from the test set and all examples were generated with a seed of 0.
      </p>

      <div style={{
        width: '100%',
        background: '#f0f4f8',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h3 style={{
          margin: '0 0 15px 0',
          color: '#2c3e50',
          borderBottom: '2px solid #3498db',
          paddingBottom: '10px'
        }}>Instructions</h3>
        <ul style={{
          listStyleType: 'none',
          padding: 0,
          margin: 0
        }}>
          <li style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <span style={{
              color: '#3498db',
              marginRight: '10px',
              fontSize: '18px'
            }}>▶</span>
            Play audio by clicking on a piano roll. Stop the audio by clicking the active piano roll again.
          </li>
          <li style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <span style={{
              color: '#3498db',
              marginRight: '10px',
              fontSize: '18px'
            }}>🎨</span>
            Note that the colours used to indicate the instruments are not consistent across loops.
          </li>
          <li style={{
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{
              color: '#3498db',
              marginRight: '10px',
              fontSize: '18px'
            }}>🌐</span>
            This website was tested on Chrome (Version 124.0.6367.78).
          </li>
        </ul>
      </div>

      <div style={{ width: '100%' }}>
        <h3>Basic tasks:</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
          {tasks.map((t) => (
            <button
              key={t}
              style={{
                backgroundColor: t === task ? 'lightblue' : 'white',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
              onClick={() => setTask(t)}
            >
              {taskMeta[t].title}
            </button>
          ))}
        </div>

        <div>
          <div style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '20px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
          }}>
            <h4 style={{
              color: '#2c3e50',
              marginTop: '0',
              marginBottom: '10px',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              {taskMeta[task].title}
            </h4>
            <p style={{
              color: '#34495e',
              marginBottom: '10px',
              lineHeight: '1.6',
              fontSize: '16px'
            }}>
              {taskMeta[task].description}
            </p>
            <p style={{
              color: '#34495e',
              margin: '0',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              Temperature used: <span style={{ fontWeight: 'normal' }}>{temperature}</span>
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <h3>Example nr {index}/{n_samples}</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setIndex((index - 1 + n_samples) % n_samples)}>
                previous example
              </button>
              <button onClick={() => setIndex((index + 1) % n_samples)}>
                next example
              </button>
              <button onClick={() => {
                const random = Math.floor(Math.random() * n_samples - 1)
                setIndex((random + index + 1) % n_samples)
              }}>
                random example
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          {examples.map((ex, i) => (
            <div
              key={ex.path}
              style={{
                width: '100%',
                backgroundColor: '#ffffff',
                borderRadius: '10px',
                padding: '10px',
                marginBottom: '20px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => {
                if (currentFile === ex.path) {
                  setCurrentFile(null)
                } else {
                  setCurrentFile(ex.path)
                }
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  backgroundColor: ex.path.includes("mlm_t=") ? '#3498db' : ex.path.includes("slm_t=") ? '#2ecc71' : '#e74c3c',
                }}
              />
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#2c3e50',
                marginBottom: '6px',
                paddingTop: '4px'
              }}>
                {ex.path.includes("mlm_t=") ? "MLM w/ restricted sampling" : ex.path.includes("slm_t=") ? "SLM" : "Natural reference"}
              </h3>
              <div style={{
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                padding: '15px',
                position: 'relative'
              }}>
                <MIDIPlayer
                  src={ex.path}
                  isPlaying={currentFile === ex.path}
                />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  borderRadius: '50%',
                  width: '60px',
                  height: '60px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: currentFile === ex.path ? 0 : 1,
                  transition: 'opacity 0.3s ease'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5V19L19 12L8 5Z" fill="#ffffff" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
