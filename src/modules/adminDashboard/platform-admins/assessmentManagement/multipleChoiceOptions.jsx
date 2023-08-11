import React from "react";
import { useEffect } from "react";
import { useFieldArray } from "react-hook-form";
import ReactDragListView from "react-drag-listview/lib/index.js";

//services
import { deleteAnswer } from "../../../../services/adminServices";

//context
import { UserAuthState } from "../../../../context/user/userContext";
import { useToastDispatch } from "../../../../context/toast/toastContext";

import ConfirmationModal from "../../../../sharedComponents/confirmationModal/confirmationModal";
import { useState } from "react";
import { useIsMounted } from "../../../../utils/useIsMounted";

function MultipleChoiceOptions({
  nestIndex,
  control,
  register,
  answerType,
  answerTypeId,
  errors,
  getValues,
  editData,
  setValue,
}) {
  const userState = UserAuthState();
  const toast = useToastDispatch();
  const isMounted = useIsMounted();

  const { fields, remove, insert, move } = useFieldArray({
    control,
    name: `assessmentsQuestion[${nestIndex}].assessmentsAnswer`,
  });

  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(undefined);

  useEffect(() => {
    if (!fields.length) {
      insert(0, { answer: "", weight: null, value: null, isActive: true });
    }
  }, [answerType]);

  const dragProps = {
    onDragEnd(fromIndex, toIndex) {
      move(fromIndex, toIndex);
    },
    nodeSelector: "li",
    handleSelector: "a",
  };

  const deleteHandler = (index) => {
    setDeleteIndex(index);
    setDeleteModalShow(true);
  };

  const answerDelete = (i) => {
    setDeleteModalShow(false);
    if (
      editData &&
      getValues("assessmentsQuestion")[nestIndex].assessmentsAnswer[i].id
    ) {
      let questionId = getValues("assessmentsQuestion")[nestIndex]
        .assessmentsAnswer[i].id;
      deleteAnswer(questionId, userState.user.id)
        .then((res) => {})
        .catch((err) => {
          console.log(err.response);
          toast({
            type: "error",
            text: "Something went wrong. Please try again !",
          });
          return;
        });
    }
    remove(i);
    toast({ type: "success", text: "Answer removed successfully" });
  };

  const watchHandler = (index) => {
    if (
      getValues(
        `assessmentsQuestion[${nestIndex}].assessmentsAnswer.${index}.value`
      )
    ) {
      setValue(
        `assessmentsQuestion[${nestIndex}].assessmentsAnswer.${index}.value`,
        parseInt(
          getValues(
            `assessmentsQuestion[${nestIndex}].assessmentsAnswer.${index}.value`
          )
        )
      );
    }
  };

  return (
    <div className="multiple-answers">
      <ConfirmationModal
        show={deleteModalShow}
        actionText={"delete this answer?"}
        actionButton="Delete"
        btnClassName="btn-danger"
        onHide={() => setDeleteModalShow(false)}
        onAction={() => answerDelete(deleteIndex)}
      />
      <ReactDragListView {...dragProps}>
        <p className="subHead-text-learner mb-2 mt-3 pl-0 text-uppercase">
          Answers
        </p>
        <ul className="answers-ul">
          {fields.map((item, index) => (
            <li key={index}>
              <div className="row">
                <div className="col-6">
                  <label className="form-label text-white" htmlFor="answer">
                    Answer {index + 1}
                  </label>

                  <input
                    id="answer"
                    type="text"
                    className="form-control mb-2 mr-2"
                    {...register(
                      `assessmentsQuestion[${nestIndex}].assessmentsAnswer.${index}.answer`
                    )}
                  />

                  <span className="error-msg">
                    {
                      errors?.assessmentsQuestion?.[nestIndex]
                        ?.assessmentsAnswer?.[index]?.answer?.message
                    }
                  </span>
                </div>

                <div className="col-2">
                  <label className="form-label text-white" htmlFor="weight">
                    Weight
                  </label>
                  <input
                    id="weight"
                    type="number"
                    className="form-control mb-2"
                    {...register(
                      `assessmentsQuestion[${nestIndex}].assessmentsAnswer[${index}].weight`
                    )}
                  />

                  <span className="error-msg">
                    {
                      errors?.assessmentsQuestion?.[nestIndex]
                        ?.assessmentsAnswer?.[index]?.weight?.message
                    }
                  </span>
                </div>

                <div className="col-2">
                  <label className="form-label text-white" htmlFor="value">
                    Value
                  </label>
                  <input
                    id="value"
                    type="number"
                    className="form-control mb-2"
                    {...register(
                      `assessmentsQuestion[${nestIndex}].assessmentsAnswer[${index}].value`
                    )}
                    onBlur={() => watchHandler(index)}
                    onKeyPress={(e) => e.key === "Enter" && e.target.blur()}
                  />
                  {/* <a href="#" className="drag-handle">
                    <span
                      className="material-icons ml-1 text-white mt-3 "
                    >
                      menu
                    </span>
                  </a> */}

                  <span className="error-msg">
                    {
                      errors?.assessmentsQuestion?.[nestIndex]
                        ?.assessmentsAnswer?.[index]?.value?.message
                    }
                  </span>
                </div>

                <div className="col-2 d-flex pl-0">
                  <i
                    className={
                      "fa-regular fa-trash-can mr-3 ml-1 text-white cursor-pointer mt-38 custom-tooltip " +
                      (index === 0 && "opacity-50")
                    }
                    onClick={() => deleteHandler(index)}
                  >
                    <span className='tooltiptext'>Delete</span>
                    
                  </i>
                  <span className="d-grid">
                    <span
                      className={
                        "material-icons slider-arrow mt-3 cursor-pointer pt-1 custom-tooltip " +
                        (index === 0 && "slider-arrow-off")
                      }
                      onClick={() => move(index, index - 1)}
                    >
                      <span className='tooltiptext'>Move up</span>
                      expand_less
                    </span>
                    <span
                      className={
                        "material-icons slider-arrow cursor-pointer mt-0 custom-tooltip " +
                        (index === fields.length - 1 && "slider-arrow-off")
                      }
                      onClick={() => move(index, index + 1)}
                    >
                      <span className='tooltiptext'>Move down</span>
                      expand_more
                    </span>
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </ReactDragListView>
      <div className="d-block mt-3">
        <span
          disabled=""
          className="material-icons mr-0 add-icon-secondary "
          onClick={() =>
            insert(fields.length, {
              answer: "",
              weight: null,
              value: null,
              isActive: true,
            })
          }
        >
          add
        </span>
        <span
          className="subText mt-1 ml-3 mb-0"
        >
          Add Answer
        </span>
      </div>
    </div>
  );
}

export default MultipleChoiceOptions;
