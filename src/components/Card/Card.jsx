import React from "react";
import "./Card.css";

const Card = ({
  noteData,
  deleteNote,
  toggleModal,
  getSelectedNoteId,
  pinHandler,
  deletePinNote,
}) => {
  const { id, title, note, color, pinned } = noteData;
  const deleteHandler = (e) => {
    e.stopPropagation();
    if (pinned) {
      deletePinNote(id);
    } else {
      deleteNote(id);
    }
  };

  const handlePin = (e) => {
    e.stopPropagation();
    pinHandler(id, noteData);
  };

  return (
    <div
      className="card card-only-text"
      style={{ backgroundColor: color }}
      onClick={() => {
        getSelectedNoteId(id);
        toggleModal(pinned);
      }}
    >
      <button className="btn-pin t4 pointer" onClick={handlePin}>
        {pinned ? "remove" : "pin"}
      </button>
      <div className="card-content">
        <p className="t3 title">{title}</p>
        <p className="t4 note">{note}</p>
      </div>
      <div className="btn-container mg-bottom-1x">
        <div className="btn-left"></div>
        <div className="btn-right">
          <button
            className="btn btn-link t4"
            onClick={(e) => {
              e.stopPropagation();
              getSelectedNoteId(id);
              toggleModal(pinned);
            }}
          >
            Edit
          </button>
          <button className="btn btn-link t4" onClick={deleteHandler}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
