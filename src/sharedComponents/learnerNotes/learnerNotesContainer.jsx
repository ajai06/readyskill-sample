import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useToastDispatch } from "../../context/toast/toastContext";

import {
  getLearnerNotesDetails,
  addLearnerNotes,
  editLearnerNotes,
  deleteLearnerNotes,
  getAllUsersNameForNote,
} from "../../services/learnersServices";
import "./learnernotes.scss";
import { UserAuthState } from "../../context/user/userContext";
import LearnerNotesComponent from "./learnerNotesComponent";
import { useLocation } from "react-router-dom";

function LearnerNotesContainer({ learnerId, isAdminDashboard }) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm({ mode: "onChange" });
  const userState = UserAuthState();
  const [learnerNotes, setLearnerNotes] = useState([]);
  const [usersList, setAllUsers] = useState([]);

  const [noteCount] = useState(7);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPageNumber, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isNote, setIsNote] = useState(false);
  const toast = useToastDispatch();
  const location = useLocation();
  const getLearnerNotes = () => {
    let isAdmin = userState.role_GlobalAdmin
      ? isAdminDashboard
        ? false
        : true
      : false;
    getLearnerNotesDetails(
      learnerId,
      userState.user.organization.organizationId,
      noteCount,
      pageNumber,
      isAdmin
    )
      .then((response) => {
        if (response.data) {
          let responseData = response.data.notes.$values;
          setIsNote(true);
          setLearnerNotes(responseData);
          setTotalPage(response.data.totalPages);
          let createrIds = responseData.map((note) => note.createrId);
          if (createrIds.length) {
            let reqData = {
              applicationUserIds: createrIds,
            };
            getAllUsersNameForNote(reqData)
              .then((response) => {
                if (response.data) {
                  let responseData = response.data;
                  setAllUsers(responseData);
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getLearnerNotes();
    return () => {
      hideNoteInput()
    }
  }, [currentPage, learnerId]);

  const next = () => {
    if (currentPage < totalPageNumber) {
      setCurrentPage(currentPage + 1);
      setPageNumber(pageNumber + 1);
    }
  };
  const previous = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
      setPageNumber(pageNumber - 1);
    } else {
      setCurrentPage(1);
    }
  };
  // adding notes
  const [addButtonClicked, setAddButtonClicked] = useState(false);

  const addNotesForLearners = () => {
    setEditNoteMode(false);
    setAddButtonClicked(true);
    reset();
  };

  const addNoteSubmit = (data) => {
    data.learnersId = learnerId;
    data.organizationId = userState.user.organization.organizationId;
    data.createrId = userState.user.id;
    data.createdDate = new Date();
    data.status = "N";
    addLearnerNotes(data)
      .then((res) => {
        toast({
          type: "success",
          text: "Note created successfully",
          timeout: 3000,
        });
        hideNoteInput();
        getLearnerNotes();
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  // editing notes

  const [editNoteMode, setEditNoteMode] = useState(false);
  const [editNoteData, setEditNodeData] = useState([]);

  const editNotesForLearners = (note) => {
    setEditNoteMode(true);
    setAddButtonClicked(true);
    setEditNodeData(note);
    setValue("note", note.note);
  };

  const editNoteSubmit = (data) => {
    data.noteId = editNoteData.noteId;
    data.learnersId = learnerId;
    data.organizationId = userState.user.organization.organizationId;
    data.createrId = userState.user.id;
    data.createdDate = new Date();
    data.status = "U";
    editLearnerNotes(data)
      .then((res) => {
        toast({
          type: "success",
          text: "Note updated successfully",
          timeout: 3000,
        });
        hideNoteInput();
        getLearnerNotes();
      })
      .catch((err) => {
        if (err.response.status === 500) {
          toast({
            type: "warning",
            text: "Attempted to perform an unauthorized operation",
            timeout: 3000,
          });
        }
      });
  };

  // deleting notes
  const deleteNoteSubmit = (note) => {
    const obj = {};
    obj.noteId = note.noteId;
    obj.note = note.note;
    obj.learnersId = note.learnersId;
    obj.organizationId = userState.user.organization.organizationId;
    obj.createrId = userState.user.id;
    obj.createdDate = new Date();
    obj.status = "D";

    deleteLearnerNotes(obj)
      .then((res) => {
        toast({
          type: "success",
          text: "Note deleted successfully",
          timeout: 3000,
        });
        getLearnerNotes();
      })
      .catch((err) => {
        if (err.response.status === 500) {
          toast({
            type: "warning",
            text: "Attempted to perform an unauthorized operation",
            timeout: 3000,
          });
        }
      });
  };

  // hide add or edit note input box
  const hideNoteInput = () => {
    setAddButtonClicked(false);
    setEditNoteMode(false);
    reset();
  };

  useEffect(() => {
    getLearnerNotes();
  }, []);
  return (
    <>
      {userState.notesReadonly &&
        <div className="learner-note d-flex">
          <div className="tab-content w-100" id="myTabContent">
            <div className="card-body bb-1">
              <div className="d-flex">
                {location.pathname !== "/portal/messagecenter" &&
                  !location.pathname.startsWith("/portal/learnersDetail") && (
                    <p className="subHead-text-learner mb-2 text-uppercase mt-3">
                      NOTES
                    </p>
                  )}
                {!editNoteMode ? (
                  <div className={`d-block w-100 ${location.pathname.startsWith("/portal/admin/learnerDetails") ? 'text-right mt-2' : ''}`}>
                    {!addButtonClicked ? (
                      <span
                        onClick={addNotesForLearners}
                        className={"material-icons add-icon-secondary mr-0 " + (!userState.notesCreate ? "opacity-50" : "")}
                      >
                        add
                      </span>
                    ) : (
                      ""
                    )}

                    <span className="subText mt-1 ml-3 mb-0">Add note</span>
                  </div>
                ) : (
                  <div className={`d-block w-100 ${location.pathname.startsWith("/portal/admin/learnerDetails") ? 'text-right mt-2' : ''}`}>
                    <span className="subText mt-1 ml-3 mb-0">Edit note</span>
                  </div>

                )}
              </div>
              {/* {
                       !editNoteMode ? <div className='d-block w-100'>

                           {
                               !addButtonClicked ? <span disabled={true} onClick={addNotesForLearners} className="material-icons badge-icons mr-0 add-icon ">
                                   add
                               </span> : ''
                           }

                           <span className="subText mt-1 ml-3 mb-0">Add note</span>

                       </div> : <span className="subText mt-1 ml-3 mb-0">Edit note</span>
                   } */}
              {addButtonClicked ? (
                <div>
                  <form>
                    <textarea
                      type="text"
                      className="notes-input"
                      {...register("note", { required: true })}
                    />
                    {errors.note ? (
                      <span className="error-msg"> Required </span>
                    ) : (
                      ""
                    )}
                  </form>

                  <div className="text-right text-msgCenter mt-2">
                    <a
                      type="button"
                      className="btn close-modal-btn"
                      onClick={hideNoteInput}
                    >
                      Cancel
                    </a>
                    {editNoteMode ? (
                      <button
                        type="button"
                        className="btn save-btn-custom ml-3"
                        onClick={handleSubmit(editNoteSubmit)}
                      >
                        Update
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn save-btn-custom ml-3"
                        onClick={handleSubmit(addNoteSubmit)}
                      >
                        Save
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
            {isNote ? (
              <LearnerNotesComponent
                learnerNotesData={learnerNotes}
                deleteNote={deleteNoteSubmit}
                editNote={editNotesForLearners}
                addButtonClicked={addButtonClicked}
                editMode={editNoteMode}
                usersData={usersList}
                userState={userState}
              />
            ) : (
              ""
            )}
          </div>

          {learnerNotes.length > 0 &&
            location.pathname !== "/portal/messagecenter" &&
            !location.pathname.startsWith("/portal/admin") && (
              <div className="card-footer d-flex pagination-footer">
                <span
                  className={
                    currentPage === 1
                      ? "material-icons filter-arrow-disabled mr-3 mt-1"
                      : "material-icons filter-arrow mr-3 mt-1"
                  }
                  onClick={previous}
                >
                  arrow_back_ios
                </span>
                <p className="subText text-uppercase mb-1">
                  Page {currentPage} 0f {totalPageNumber}
                </p>
                <span
                  className={
                    currentPage === totalPageNumber
                      ? "material-icons filter-arrow-disabled ml-3 mt-1"
                      : "material-icons filter-arrow ml-3 mt-1"
                  }
                  onClick={next}
                >
                  arrow_forward_ios
                </span>
              </div>
            )}
        </div>}

    </>
  );
}

export default LearnerNotesContainer;
