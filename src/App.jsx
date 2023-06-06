import React from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Split from "react-split";
import "./styles/style.css";
import NoteImg from "./assets/note.png";
import { onSnapshot, doc, addDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { notesCollection, dataBase } from '../firebase';

export default function App() {
  const [notes, setNotes] = React.useState([]);
  const [currentNoteId, setCurrentNoteId] = React.useState("");
  const [tempNoteText, setTempNoteText] = React.useState('');
  
  const currentNote =  notes.find(note => note.id === currentNoteId) || notes[0];

  const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt)

  React.useEffect(() => {
    const unsubscribe = onSnapshot(notesCollection, function(snapshot){
      // sync up our local notes array with the snapshot data
      const notesArr = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }))
      setNotes(notesArr);
    })
    return unsubscribe;
  }, []);

  React.useEffect(() =>{
    if(!currentNoteId){
      setCurrentNoteId(notes[0]?.id)
    }
  }, [notes])

  React.useEffect(() =>{
      if (currentNote){
        setTempNoteText(currentNote.body);
      } 
  }, [currentNote])

  React.useEffect(() =>{
    const timeOutId = setTimeout(() => {
      if(tempNoteText !== currentNote.body){
        updateNote(tempNoteText)
      }
    }, 500)
    return () => clearTimeout(timeOutId)
  }, [tempNoteText]);

  async function createNewNote() {
    const newNote = {
      body: "# Type your markdown note's title here",
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    const newNoteRef= await addDoc(notesCollection, newNote);
    setCurrentNoteId(newNoteRef.id);
  }

  async function updateNote(text) {
    const docRef = doc(dataBase, "notes", currentNoteId)
    await setDoc(
            docRef, 
            { body: text, updatedAt:Date.now() }, {merge: true})
  }

  async function deleteNote(noteId) {
    const docRef = doc(dataBase, "notes", noteId)
    await deleteDoc(docRef)
  }
/*
  function findCurrentNote() {
    // This function returns the current note.

    // Find the note in the notes array with the given ID.
    return (
      notes.find((note) => {
        return note.id === currentNoteId;
        // If the note is not found, return the first note in the array
      }) || notes[0]
    );
  }
*/
  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={sortedNotes}
            currentNote={currentNote}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNote={deleteNote}
          />
          {
            <Editor 
              tempNoteText={tempNoteText} 
              setTempNoteText={setTempNoteText} 
            />
          }
        </Split>
      ) : (
        <>
          <h1 className="app-title">Notes Markdown App</h1>

          <div className="no-notes">
            <img src={NoteImg} alt="" />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifContent: "center",
                alignItems: "center",
              }}
            >
              <h2>Oops! The list is Empty...</h2>
              <button className="first-note" onClick={createNewNote}>
                CREATE ONE
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}