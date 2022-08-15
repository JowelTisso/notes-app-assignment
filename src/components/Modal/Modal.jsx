import React from "react";

function Modal({ children, toggleModal }) {
  return (
    <div id="modal" className="modal hide-modal">
      <div
        id="modal-backdrop"
        className="modal-backdrop"
        onClick={toggleModal}
      ></div>
      <div className="modal-content">{children}</div>
    </div>
  );
}

export default Modal;
