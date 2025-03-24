import Term from "./components/terminal"
import './App.css'
import { useCallback, useEffect, useState } from "react"
import FileTree from './components/filesys'
import socket from "./socket"
import AceEditor from "react-ace"
import ModalForm from "./components/ModalForm"

function App() {
  const [fileTree, setFileTree] = useState({})
  const [selectedFile, setSelectedFile] = useState('')
  const [selectedFileContent, setSelectedFileContent] = useState('')
  const [code, setCode] = useState('')
  const [name, setName] = useState(null)

  useEffect(() => {
    const handleWindowMouseMove = event => {
      console.log()
      if (!name) return
      socket.emit('mouse:move', {
        x: event.clientX*100/window.innerWidth,
        y: event.clientY*100/window.innerHeight,
        person: name
      });
    };
    window.addEventListener('mousemove', handleWindowMouseMove);

    return () => {
      window.removeEventListener(
        'mousemove',
        handleWindowMouseMove,
      );
    };
  }, [name]);

  let isSaved = selectedFileContent === code;

  const getFileTree = async () => {
    const response = await fetch('http://localhost:3001/files')
    const result = await response.json()
    setFileTree(result.tree)
  };

  const getFileContent = useCallback(async () => {
    if (!selectedFile) return;
    const response = await fetch(`http://localhost:3001/files/content?path=${selectedFile}`)
    const result = await response.json()
    setSelectedFileContent(result.content)
  }, [selectedFile])

  useEffect(() => {
    getFileTree()
  }, [])

  useEffect(() => {
    socket.on('file:refresh', getFileTree)
    return () => {
      socket.off("file:refresh", getFileTree)
    }
  })
  useEffect(() => {
    socket.on('file:change', ({ path, content }) => {
      if (path === selectedFile) {
        setSelectedFileContent(content)
      }
    })
  })
  useEffect(() => {
    socket.on('mouse:move', ({ x, y, person }) => {
      if (person === name) return;
      else {console.log("Mouse moved", x, y, person) }
    })
  })

  useEffect(() => {
    if (selectedFile) getFileContent();
  }, [getFileContent, selectedFile])
  useEffect(() => {
    if (selectedFile && selectedFileContent) setCode(selectedFileContent);
  }, [selectedFile, selectedFileContent])
  useEffect(() => {
    setCode('')
  }, [selectedFile])

  useEffect(() => {
    if (code && !isSaved) {
      const timer = setTimeout(() => {
        setSelectedFileContent(code)
        socket.emit('file:change', {
          path: selectedFile,
          content: code
        })
      }, 1000);
      return () => {
        clearTimeout(timer)
      }
    }
  })

  return (
    <div className="app-container">
      {!name && <ModalForm onSubmit={(name) => setName(name)} />}

      {/* Main Content (Only Shows After Name is Entered) */}
      {name && (
        <div className="playground">
          <div className="editor-cont">
            <div className="files">
              <FileTree tree={fileTree} onSelect={setSelectedFile} />
            </div>
            <div className="editor">
              {selectedFile ? <p>{selectedFile} {isSaved ? '(Saved)' : '(Saving...)'}</p> : <p>No file selected</p>}
              {selectedFile && <AceEditor
                onCursorChange={(e) => { console.log(e) }}
                mode="javascript"
                theme='xcode'
                value={code}
                width="100%"
                showPrintMargin={false}
                onChange={(e) => { setCode(e) }}
              />}
            </div>
          </div>
          <div id="term-cont">
            <Term />
          </div>
        </div>
      )}</div>
  )
}

export default App
