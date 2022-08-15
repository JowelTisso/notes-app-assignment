import React, { useState, useEffect } from "react";
import "./Home.css";
import InputCard from "../../components/InputCard/InputCard";
import Card from "../../components/Card/Card";
import toast from "react-hot-toast";
import axios from "axios";
import { API } from "../../utils/Constant";
import Spinner from "../../components/spinner/Spinner";
import Pagination from "@mui/material/Pagination";
import Modal from "../../components/Modal/Modal";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [pinnedNotes, setPinnedNotes] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [editPin, setEditPin] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const showPinnedNotes = pinnedNotes.length > 0;

  const loadNotes = async (page = 1, limit = 6) => {
    try {
      const res = await axios.get(
        `${API.NOTES}?sortBy=createdAt&order=desc&page=${page}&limit=${limit}`
      );
      if (res.status === 200) {
        const pages = Math.ceil(res.data.totalItems / limit);
        setTotalPage(pages);
        setNotes(res.data.notes);
      }
    } catch (err) {
      toast.error("Unable to get notes! " + "Error: " + err.message);
    }
  };

  const getPages = async (page = 1, limit = 6) => {
    try {
      const res = await axios.get(
        `${API.NOTES}?sortBy=createdAt&order=desc&page=${page}&limit=${limit}`
      );
      if (res.status === 200) {
        const pages = Math.ceil(res.data.totalItems / limit);
        setTotalPage(pages);
      }
    } catch (err) {
      toast.error("Unable to get pages! " + "Error: " + err.message);
    }
  };

  const saveNote = async (note) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API.NOTES}`, note);
      if (res.status === 201) {
        const newList = [...notes];
        if (notes.length === 6) {
          newList.pop();
          newList.unshift(res.data);
        } else {
          newList.unshift(res.data);
        }
        getPages();
        setNotes(newList);
        toast.success("Notes added!");
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error(err.message);
    }
  };

  const deleteNote = async (id, isPinning = false) => {
    try {
      setLoading(true);
      const res = await axios.delete(`${API.NOTES}/${id}`);
      if (res.status === 200) {
        getPages();
        setNotes((list) => list.filter((item) => item.id != id));
        if (!isPinning) toast.success("Deleted successfully!");
      }
      setLoading(false);
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  const updateNote = async (id, note) => {
    try {
      setLoading(true);
      const res = await axios.put(`${API.NOTES}/${id}`, note);
      if (res.status === 200) {
        const index = notes.findIndex((note) => note.id === res.data.id);
        const newList = [...notes];
        newList.splice(index, 1, res.data);
        setNotes([...newList]);
        toast.success("Updated successfully!");
        toggleModal();
      }
      setLoading(false);
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  const updatePinnedNote = async (id, note) => {
    try {
      setLoading(true);
      const res = await axios.put(`${API.PINNED}/${id}`, note);
      if (res.status === 200) {
        const index = pinnedNotes.findIndex((note) => note.id === res.data.id);
        const newList = [...pinnedNotes];
        newList.splice(index, 1, res.data);
        setPinnedNotes([...newList]);
        toast.success("Updated successfully!");
        toggleModal();
      }
      setLoading(false);
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  const toggleModal = (pinned) => {
    if (pinned) {
      setEditPin(true);
    } else {
      setEditPin(false);
    }
    setIsModal((state) => !state);
  };

  const getSelectedNoteId = (id) => {
    setSelectedNoteId(id);
  };

  const removePin = async (id, note) => {
    try {
      setLoading(true);
      const res = await axios.delete(`${API.PINNED}/${id}`);
      if (res.status === 200) {
        setPinnedNotes((list) => list.filter((item) => item.id != id));
        const newNote = { ...note, pinned: false };
        saveNote(newNote);
        toast.success("Unpinned successfully!");
      }
      setLoading(false);
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  const addPin = async (id, note) => {
    try {
      setLoading(true);
      const newNote = { ...note, pinned: true };
      const res = await axios.post(`${API.PINNED}`, newNote);
      if (res.status === 201) {
        await deleteNote(id, true);
        if (currentPage < totalPage) {
          loadNotes(currentPage);
        }
        setPinnedNotes((notes) => notes.concat(res.data));
        toast.success("Pinned successfully!");
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error(err.message);
    }
  };

  const deletePinNote = async (id) => {
    try {
      setLoading(true);
      const res = await axios.delete(`${API.PINNED}/${id}`);
      if (res.status === 200) {
        setPinnedNotes((list) => list.filter((item) => item.id != id));
        toast.success("Deleted successfully!");
      }
      setLoading(false);
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  const pinHandler = (id, note) => {
    if (note.pinned) {
      removePin(id, note);
    } else {
      if (pinnedNotes.length >= 6) {
        toast.error("Maximum pinned notes reached!");
      } else {
        addPin(id, note);
      }
    }
  };

  const pageChangeHandler = (event, value) => {
    setCurrentPage(value);
    loadNotes(value);
  };

  useEffect(() => {
    loadNotes();
    (async () => {
      try {
        const res = await axios.get(
          `${API.PINNED}?sortBy=createdAt&order=desc`
        );
        if (res.status === 200) {
          setPinnedNotes(res.data);
        }
      } catch (err) {
        toast.error("Unable to get notes! " + "Error: " + err.message);
      }
    })();
  }, []);

  return (
    <div className="main flex-center">
      {loading && <Spinner />}
      <p className="t3 mg-top-2x">Notes</p>
      <div className="add-container mg-top-2x flex-center">
        <InputCard saveNote={saveNote} mode="new" />
      </div>
      {showPinnedNotes && (
        <>
          <p className="t3 mg-left-2x mg-top-2x">Pinned notes</p>
          <div className="notes-container">
            {pinnedNotes.map((note) => (
              <Card
                key={note.id}
                noteData={note}
                deleteNote={deleteNote}
                toggleModal={toggleModal}
                getSelectedNoteId={getSelectedNoteId}
                pinHandler={pinHandler}
                deletePinNote={deletePinNote}
              />
            ))}
          </div>
        </>
      )}
      <p className="t3 mg-left-2x mg-top-2x">Saved notes</p>
      <div className="notes-container">
        {notes.map((note) => (
          <Card
            key={note.id}
            noteData={note}
            deleteNote={deleteNote}
            toggleModal={toggleModal}
            getSelectedNoteId={getSelectedNoteId}
            pinHandler={pinHandler}
          />
        ))}
      </div>

      <Pagination
        className="mg-top-5x"
        count={totalPage}
        color="primary"
        page={currentPage}
        size="large"
        onChange={pageChangeHandler}
      />

      {isModal && (
        <Modal toggleModal={toggleModal}>
          <InputCard
            notes={editPin ? pinnedNotes : notes}
            updateNote={updateNote}
            updatePinnedNote={updatePinnedNote}
            mode="edit"
            selectedNoteId={selectedNoteId}
            toggleModal={toggleModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default Home;
