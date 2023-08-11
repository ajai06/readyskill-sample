import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { UserAuthState } from "../../context/user/userContext";

const LearnerNotesComponent = React.memo(
  ({
    learnerNotesData,
    deleteNote,
    editNote,
    addButtonClicked,
    editMode,
    usersData,
  }) => {
    const [delteData, setDeleteData] = useState({});
    const [noteIndex, setNoteIndex] = useState("");
    const location = useLocation();
  const userState = UserAuthState();

    const getName = (note) => {
      if (usersData) {
        if (usersData.find((d) => d.id === note.createrId)) {
          return `${usersData.find((d) => d.id === note.createrId).firstName} ${
            usersData.find((d) => d.id === note.createrId).lastName
          }`;
        } else {
          return "";
        }
      } else {
        return "";
      }
    };

    const Notedelete = (note) => {
      setDeleteData(note);
    };
    return (
      <div>
        <div
          className={
            location.pathname === "/portal/messagecenter"
              ? "note-body-inner-1"
              : location.pathname.startsWith("/portal/admin")
              ? "note-body-inner-2"
              : "note-body-inner"
          }
        >
          {learnerNotesData?.length > 0 && (
            <div>
              {learnerNotesData.map((notes, i) => (
                <div
                  className="card-body bb-1 notes-card py-1 pl-5"
                  key={notes.$id}
                >
                  <div className="d-flex mt-2">
                    <p className="text-capitalize note-head mb-0">
                      {getName(notes)}
                    </p>
                    <p className="text-capitalize note-dateText ml-3 mb-0 mt-1">
                      {new Date(notes.createdDate).toLocaleString("en-us", {
                        weekday: "short",
                      })}{" "}
                      {new Date(notes.createdDate).toLocaleString("en-US", {
                        month: "numeric",
                        day: "numeric",
                        year: "2-digit",
                      })}
                    </p>
                    {!addButtonClicked && !editMode ? (
                      <span className={"ml-auto" + (!userState.noteDelete ? " opacity-50" : "")}>
                        <i
                          className="fa-regular fa-trash-can note-delete-icon delete-btn  mr-1 pt-3"
                          data-toggle="modal"
                          onClick={() => {
                            Notedelete(notes);
                          }}
                          data-target="#delete-modal-user"
                        >
                        </i>
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                  {i !== noteIndex && (
                    <div className="note-overflow">
                      <p>
                        <a
                          className={"note-subText pointer" + (!userState.noteDelete ? " opacity-50" : "")}
                          onClick={() => userState.notesEdit ? editNote(notes) : undefined}
                        >
                          {notes.note.trim().length < 180
                            ? notes.note
                            : notes.note.slice(0, 180) + `...`}
                        </a>
                        {notes.note.trim().length > 180 && (
                          <span
                            className="note-subText note-read-more"
                            onClick={() => {
                              setNoteIndex(i);
                            }}
                          >
                            Read More
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                  {i === noteIndex && (
                    <div style={{ maxHeight: 100, overflowY: "auto" }}>
                      <p>
                        <a
                          className={"note-subText pointer" + (!userState.noteDelete ? " opacity-50" : "")}
                          onClick={() => userState.notesEdit ? editNote(notes) : undefined}
                        >
                          {notes.note}
                        </a>{" "}
                        <span
                          className="note-subText note-read-more"
                          onClick={() => {
                            setNoteIndex("");
                          }}
                        >
                          Read Less
                        </span>
                      </p>
                    </div>
                  )}
                  {/* modal for delete */}
                  <div
                    className="modal fade"
                    id="delete-modal-user"
                    tabIndex="-1"
                    aria-labelledby="delete-modal"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5
                            className="modal-title subHead-text-learner"
                            id="delete-modalLabel"
                          >
                            Are you sure?
                          </h5>
                          <button
                            type="button"
                            className="btn-close"
                            data-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div className="modal-body text-white">
                          Are you sure you want to delete this note?
                        </div>
                        <div className="modal-footer">
                          <a
                            className="close-modal-btn"
                            onClick={() => setDeleteData({})}
                            data-dismiss="modal"
                          >
                            Cancel
                          </a>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => deleteNote(delteData)}
                            data-dismiss="modal"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* modal for delete ends*/}
                </div>
              ))}
              <p className="subText  text-center my-2">No Additional Notes</p>
            </div>
          )}
          {!learnerNotesData?.length && (
            <p className="subText text-center mt-5 pt-5 mb-0">NO NOTES</p>
          )}
        </div>
      </div>
    );
  }
);

export default React.memo(LearnerNotesComponent);
