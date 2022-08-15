import React, { useState } from "react";
import "./InputCard.css";
import { v4 as uuidv4 } from "uuid";
import { COLOR, formatDate } from "../../utils/Constant";
import toast from "react-hot-toast";

const InputCard = ({
  notes,
  saveNote,
  mode,
  updateNote,
  toggleModal,
  selectedNoteId,
  updatePinnedNote,
}) => {
  const defaultData = {
    id: 0,
    title: "",
    note: "",
    color: COLOR.white,
    pinned: false,
    createdAt: "",
  };

  const selectedNote = notes
    ? notes.find((note) => note.id === selectedNoteId)
    : {};

  const [noteData, setNoteData] = useState(
    mode === "edit" ? selectedNote : defaultData
  );

  const { title, note, color, pinned } = noteData;

  const clearField = () => {
    setNoteData(defaultData);
  };

  const saveHandler = async () => {
    if (title && note) {
      switch (mode) {
        case "new":
          await saveNote({
            id: uuidv4(),
            title,
            note,
            color,
            pinned,
            createdAt: formatDate(),
          });
          clearField();
          break;
        case "edit":
          if (pinned) {
            updatePinnedNote(selectedNoteId, noteData);
          } else {
            updateNote(selectedNoteId, noteData);
          }
          break;
        default:
          break;
      }
    } else {
      toast.error("Empty field");
    }
  };

  return (
    <div
      className={`card card-only-text ${mode === "new" ? "w-31" : "w-95"}`}
      style={{ backgroundColor: color }}
    >
      <div className="card-content">
        <input
          type="text"
          className="input-simple-title t3"
          placeholder="Title"
          value={title}
          onChange={({ target }) =>
            setNoteData((data) => ({ ...data, title: target.value }))
          }
          maxLength={25}
        />
        <textarea
          type="text"
          className="input-simple-note t4 mg-top-2x"
          placeholder="Take note"
          value={note}
          rows={mode === "new" ? 3 : 4}
          onChange={({ target }) =>
            setNoteData((data) => ({ ...data, note: target.value }))
          }
        />
      </div>
      <div className="btn-container mg-bottom-1x">
        <div className="btn-left mg-left-1x">
          {Object.keys(COLOR).map((color) => (
            <button
              key={color}
              className={`btn-circle mg-left-1x pointer ${color}`}
              onClick={() =>
                setNoteData((data) => ({ ...data, color: COLOR[color] }))
              }
            ></button>
          ))}
        </div>
        <div className="btn-right">
          <button className="btn btn-link t4" onClick={saveHandler}>
            Save
          </button>
          <button className="btn btn-link t4" onClick={toggleModal}>
            {mode === "edit" ? "Close" : "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputCard;
