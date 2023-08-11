import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import AssessmentQuestion from "./assessmentQ1";
// import "react-tabs/style/react-tabs.css";

//context
import { UserAuthState } from "../../../../context/user/userContext";
import { useToastDispatch } from "../../../../context/toast/toastContext";

//services
import { deleteQuestionAnswer } from "../../../../services/adminServices";

import "../platformAdmin.scss";
import ConfirmationModal from "../../../../sharedComponents/confirmationModal/confirmationModal";

function AssessmentQuestionTab({
  useFieldArray,
  control,
  register,
  getValues,
  watch,
  errors,
  setValue,
  answerTypes,
  categoryList,
  setError,
  clearErrors,
  editData,
  tabIndexNoErrorQuestion
}) {
  const userState = UserAuthState();
  const toast = useToastDispatch();

  const { fields, insert, remove } = useFieldArray(
    { name: "assessmentsQuestion", control },
    { name: "assessmentGroupMapping", control }
  );

  const [tabIndexNo, setTabIndexNo] = useState(0);

  useEffect(() => {
    if (editData && !fields.length) {
      let objPatch = Object.assign([], editData.assessmentsQuestion.$values);

      editData.assessmentsQuestion
        ? patchData(objPatch)
        : setValue("assessmentsQuestion", []);
    }
  }, [editData]);
  useEffect(() => {
    if (tabIndexNoErrorQuestion) {
      setTabIndexNo(tabIndexNoErrorQuestion)
    }
  }, [tabIndexNoErrorQuestion])

  const patchData = (data) => {
    data.forEach((element) => {
      element.assessmentsAnswer = element.assessmentsAnswer?.$values;
    });
    setValue("assessmentsQuestion", data);
  };

  const addRow = () => {
    insert(fields.length, { isActive: true, assessmentAnswerTypeId: "" });
    setTabIndexNo(fields.length);
  };

  const deleteRow = (i) => {
    const oldVal = fields.length;
    if (editData && getValues("assessmentsQuestion")[i].id) {
      let questionId = getValues("assessmentsQuestion")[i].id;

      deleteQuestionAnswer(questionId, userState.user.id)
        .then((res) => {
          console.log(res)

        })
        .catch((err) => {
          console.log(err.response);
          toast({
            type: "error",
            text: "Something went wrong. Please try again !",
          });
          return;
        });
    }
    if (oldVal > 1 && i === 0) {
      remove(i);
      setTabIndexNo(i);
    } else {
      remove(i);
      setTabIndexNo(i - 1);
    }
    setCurrentDeleteIndex();
    setDeleteModalShow(false)
    toast({ type: "success", text: "Question removed successfully" });
  };

  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [currentDeleteIndex, setCurrentDeleteIndex] = useState();

  return (
    <div className="question-tabs questions-container">
      {
        deleteModalShow && <ConfirmationModal
          show={deleteModalShow}
          actionText={"delete this question?"}
          actionButton="Delete"
          btnClassName="btn-danger"
          onHide={() => setDeleteModalShow(false)}
          onAction={() => {
            deleteRow(currentDeleteIndex);
          }}
        />
      }
      <Tabs
        selectedIndex={tabIndexNo}
        onSelect={(index) => setTabIndexNo(index)}
      >
        <div className="row">
          <div className="col-3">
            <p className="subHead-text-learner mb-2 mt-3 text-uppercase">
              instructions
            </p>
            <p className="text-white">
              The questions page contains one or more questions the learner will be asked and the possible answers the learner may select.
            </p>
            <p className="subHead-text-learner mb-3 mt-4 text-uppercase">
              Manage Questions
            </p>
            <p className="text-uppercase subText text-white mb-1">
              {fields.length} {fields.length > 1 ? "Questions" : "Question"}
            </p>
            <p className="text-uppercase subText mb-0">
              Estimated Time: {Math.ceil(fields.length * 0.75)} {Math.ceil(fields.length * 0.75) > 1 ? "Mins" : "Min"}
            </p>

            <div className="question-list-main ">
              <TabList className="question-list pl-0 pr-3 mt-3 mb-3">
                {fields.map((item, i) => (
                  <Tab key={i}>
                    <div className="d-flex">
                      <p
                        className={
                          "mt-2 " +
                          (tabIndexNo === i ? "subHead-text-learner" : "")
                        }
                      >
                        Question {i + 1}
                      </p>
                      <span onClick={() => { setCurrentDeleteIndex(i); setDeleteModalShow(true); }} className="fa-regular fa-trash-can list-fun-btns delete-btn ml-5 cursor-pointer mr-0 mt-2 pt-1 false">
                        
                      </span>
                    </div>
                  </Tab>
                ))}
              </TabList>
            </div>
            <div className="d-block mt-2">
              <span
                disabled=""
                className="material-icons add-icon-secondary mr-0 "
                onClick={addRow}
              >
                add
              </span>
              <span
                className="subText cursor-pointer mt-0 ml-3 mb-0"
                onClick={addRow}
              >
                Add Question
              </span>
            </div>
          </div>
          <div className="col-9">
            {fields.map((item, i) => (
              <TabPanel key={i}>
                <AssessmentQuestion
                  {...{
                    control,
                    register,
                    getValues,
                    setValue,
                    watch,
                    remove,
                    errors,
                    setError,
                    clearErrors,
                  }}
                  index={i}
                  answerTypes={answerTypes}
                  deleteForm={deleteRow}
                  categoryList={categoryList}
                  editData={editData}
                />
              </TabPanel>
            ))}
          </div>
        </div>
      </Tabs>
    </div>
  );
}

export default AssessmentQuestionTab;
