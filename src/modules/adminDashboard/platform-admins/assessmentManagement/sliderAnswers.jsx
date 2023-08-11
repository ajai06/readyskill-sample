import React from "react";
import { useEffect } from "react";
import { useFieldArray } from "react-hook-form";

// services
import { deleteAnswer } from "../../../../services/adminServices";

//context
import { UserAuthState } from "../../../../context/user/userContext";
import { useToastDispatch } from "../../../../context/toast/toastContext";

import { useState } from "react";
import ConfirmationModal from "../../../../sharedComponents/confirmationModal/confirmationModal";

function SliderAnswers({
  nestIndex,
  control,
  register,
  type,
  watch,
  setValue,
  getValues,
  errors,
  editData,
  answerType,
  answerTypeId,
}) {
  const { fields, remove, insert } = useFieldArray({
    control,
    name: `assessmentsQuestion[${nestIndex}].assessmentsAnswer`,
  });

  const userState = UserAuthState();
  const toast = useToastDispatch();

  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(undefined);

  useEffect(() => {
    if (!fields.length) {
      insert(0, { answer: "", weight: 1, value: null, isActive: true });
    }
  }, [answerType]);

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

  return (
    <div className="answers-slide mt-4">
      <ConfirmationModal
        show={deleteModalShow}
        actionText={"delete this answer?"}
        actionButton="Delete"
        btnClassName="btn-danger"
        onHide={() => setDeleteModalShow(false)}
        onAction={() => answerDelete(deleteIndex)}
      />
      {fields.map((field, index) => (
        <div className="row" key={index}>
          <div className="col-5">
            <label className="form-label subText" htmlFor="answer">
              Answer {index+1}
            </label>
            <input
              id="answer"
              type="text"
              className="form-control mb-2"
              {...register(
                `assessmentsQuestion[${nestIndex}].assessmentsAnswer.${index}.answer`
              )}
            />
            <span className="error-msg">
              {
                errors?.assessmentsQuestion?.[nestIndex]?.assessmentsAnswer?.[
                  index
                ]?.answer?.message
              }
            </span>
          </div>
          <div className="col-5">
            <label className="form-label subText" htmlFor="value">
              Value
            </label>
            <input
              id="value"
              type="number"
              className="form-control mb-2"
              {...register(
                `assessmentsQuestion[${nestIndex}].assessmentsAnswer.${index}.value`
              )}
              onBlur={() => watchHandler(index)}
              onKeyPress={(e) => e.key === "Enter" && e.target.blur()}
            />
            <span className="error-msg">
              {
                errors?.assessmentsQuestion?.[nestIndex]?.assessmentsAnswer?.[
                  index
                ]?.value?.message
              }
            </span>
          </div>
          <div className="col-2">
            <i
              className={
                "fa-regular fa-trash-can ml-0 text-white mr-3 mt-38 cursor-pointer custom-tooltip " +
                (index === 0 ? "opacity-50" : "")
              }
              onClick={() => deleteHandler(index)}
            >
              <span className='tooltiptext'>Delete</span>
              
            </i>
          </div>
        </div>
      ))}
      <div className="d-block mt-3">
        <span
          disabled=""
          className="material-icons badge-icons cursor-pointer mr-0 add-icon "
          onClick={() =>
            insert(fields.length, {
              answer: "",
              weight: 1,
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

export default SliderAnswers;
