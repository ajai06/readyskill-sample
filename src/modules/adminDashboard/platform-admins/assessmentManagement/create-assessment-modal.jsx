import React, { useState, useEffect } from "react";

import { Modal } from "react-bootstrap";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import { useForm, useFieldArray, set } from "react-hook-form";

import AssessmentSettings from "./assessmentSettings";
import AssessmentIntro from "./assessmentIntro";
import AssessmentThankYou from "./assessmentThankYou";

import {
  createAssessment,
  updateAssessment,
  getComputationList,
  getReminderOptions,
  redirectOptionsList,
  assessmentNameCheck,
  getAnswerTypes,
  getExistingCategoryList,
  getAssessmentType,
} from "../../../../services/adminServices";

import { getGroups } from "../../../../services/adminServices";

import { UserAuthState } from "../../../../context/user/userContext";

import { PlatFormAdminConstants } from "../../../../utils/contants";

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import "react-tabs/style/react-tabs.css";

import "../platformAdmin.scss";
import { useToastDispatch } from "../../../../context/toast/toastContext";
import AssessmentQuestionTab from "./assessmentQuestionTab";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useIsMounted } from "../../../../utils/useIsMounted";

function CreateAssessmentModal({
  onHide,
  editData,
  setEditData,
  asessmentManageList,
  ...props
}) {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required(),
    description: Yup.string().required("Description required"),
    typeId: Yup.string().required("Assessment type required"),
    assessmentsQuestion: Yup.array().of(
      Yup.object().shape({
        question: Yup.string().required("Name is required"),
        weight: Yup.string().required("Weight is required"),
        category: Yup.string().required("Category is required"),
        assessmentAnswerTypeId: Yup.string().required(
          "Answer type is required"
        ),
        assessmentsAnswer: Yup.array().of(
          Yup.object().shape({
            answer: Yup.string().required("Answer is required"),
            weight: Yup.string().required("Weight is required").nullable(),
            value: Yup.number()
              .typeError("Value is required")
              .required("Value is required")
              .nullable(),
          })
        ),
      })
    ),
  });

  const formOptions = { resolver: yupResolver(validationSchema), mode: 'onChange', };

  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
    setError,
    clearErrors,
    watch,
    reset,
    formState: { errors },
  } = useForm(formOptions);

  const userState = UserAuthState();
  const toast = useToastDispatch();

  const [loading, setLoading] = useState(false);

  const [reminderOptions, setReminderOptions] = useState([]);
  const [computationList, setComputationList] = useState([]);
  const [redirectionList, setRedirectionList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [answerTypes, setAnswerTypes] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [AssessmentTypeList, setAssessmentType] = useState([]);

  const [checkedGroups, setCheckedGroups] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [tabIndexNo, setTabIndexNo] = useState(0);
  const [tabIndexNoErrorQuestion, setTabIndexNoErrorQuestion] = useState(undefined);
  const isMounted = useIsMounted();


  useEffect(() => {
    // Anser types API function call
    getAnswerTypeValues();
    getExistingCategoryValues();
    getAssessMentTypesList();
    (async () => {
      setLoading(true);
      try {
        let groups = await getGroups(
          userState.user.organization.organizationId
        );
        setGroupList(groups.data);
      } catch (error) {
        console.log(error.response);
      }
      try {
        let computations = await getComputationList();
        setComputationList(computations.data.$values);
      } catch (error) {
        console.log(error.response);
      }
      try {
        let reminder = await getReminderOptions();
        setReminderOptions(reminder.data.$values);
      } catch (error) {
        console.log(error.response);
      }
      try {
        let redirects = await redirectOptionsList();
        setRedirectionList(redirects.data.$values);
        setValue("redirectPageId", redirects.data.$values[0].id);
        setLoading(false);
      } catch (error) {
        console.log(error.response);
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (editData) {
      setEditMode(true);
      patchData(editData);
    }
  }, [editData]);

  const patchData = (data) => {
    setTimeout(() => {
      setValue("name", data.name);
      setValue("description", data.description);
      setValue("typeId", data.typeId);
      setValue("reminderId", data.reminderId);
      setValue("resultComputationId", data.resultComputationId);
      setValue("redirectPageId", data.redirectPageId);
      setValue("showThankYouPage", data.showThankYouPage);
      setValue("shortDescription", data.shortDescription);
      setValue("longDescription", data.longDescription);
      setValue("thankYouDescription", data.thankYouDescription);
      setValue("additionalInstructions", data.additionalInstructions);
    }, 500);
   
  };

  const nameCheck = async (value) => {
    // await wait(1000);
    if ((editMode && editData.name !== value) || !editMode) {
      assessmentNameCheck(value)
        .then((res) => {
          if (isMounted()) {
            if (res.data) {
              setError("name", {
                type: "validate",
              });
            } else {
              clearErrors("name");
            }
          }
        })
        .catch((err) => {
          console.log(err.response);
        });
    } else {
      clearErrors("name");
    }
  };

  const getAnswerTypeValues = () => {
    getAnswerTypes()
      .then((res) => {
        if (res.data) {
          if (isMounted()) {
            setAnswerTypes(res.data.$values);
          }
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const getAssessMentTypesList = () => {
    getAssessmentType()
      .then(res => {
        if (res?.data?.$values) {
          let response = res.data.$values;
          setAssessmentType(response)
        }
      })
      .catch((err) => {
        console.log(err.response);
      });

  }

  const getExistingCategoryValues = () => {
    getExistingCategoryList()
      .then((res) => {
        if (res.data) {
          if (isMounted()) {
            setCategoryList(res.data.$values);
          }
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const submitForm = (data) => {
    if (errors?.name?.type === "validate") {
      setError("name", {
        type: "validate",
      });
      return;
    }
    if (editMode) {
      // get previously checked values
      const prevCheckedGroups = editData.assessmentGroupMapping.$values;

      // lets filter currently unchecked & previously checked values from old values
      let uncheckedFiltered = [].concat(
        prevCheckedGroups.filter((obj1) =>
          checkedGroups.every((obj2) => obj1.groupId !== obj2.groupId)
        )
      );

      // set false values to the unchecked one
      let uncheckedValues = uncheckedFiltered.map((item) => ({
        ...item,
        isActive: false,
      }));

      // lets filter currently & previously checked values from old values
      let checkedFiltered = [].concat(
        prevCheckedGroups.filter((objj1) =>
          checkedGroups.some((objj2) => objj1.groupId === objj2.groupId)
        )
      );

      // lets filter newly added
      let newlyChecked = [].concat(
        checkedGroups.filter((objjj1) =>
          checkedFiltered.every((objjj2) => objjj1.groupId !== objjj2.groupId)
        )
      );

      // merge checked and unchecked and newly added array together
      data.assessmentGroupMapping = newlyChecked
        .concat(uncheckedValues)
        .concat(checkedFiltered);
    } else {
      data.assessmentGroupMapping = checkedGroups;
    }

    if (data.resultComputationId === "") {
      data.resultComputationId = null;
    }
    if (data.reminderId === "") {
      data.reminderId = null;
    }
    if (data.redirectPageId === "") {
      data.redirectPageId = null;
    }

    data.applicationUserId = userState.user.id;
    data.publicName = data.name;
    //data.typeId =data.typeId

    if (data.assessmentsQuestion) {
      data.assessmentsQuestion = data.assessmentsQuestion.map((item, i) => ({
        ...item,
        order: i + 1,
      }));
      data.assessmentsQuestion.forEach((element) => {
        if (element.assessmentsAnswer) {
          element.assessmentsAnswer = element.assessmentsAnswer.map(
            (item, i) => ({ ...item, order: i + 1 })
          );
        }
      });
    }

    setLoading(true);
    editMode ? editAssessment(data) : addAssessment(data);
  };

  const addAssessment = (data) => {
    data["assessmentsQuestion"] = data.assessmentsQuestion
      ? data.assessmentsQuestion.map((obj) => {
        return {
          order: obj.order,
          question: obj.question,
          category: obj.category,
          weight: obj.weight,
          assessmentAnswerTypeId: obj.assessmentAnswerTypeId,
          preQuestionPhrase: obj.preQuestionPhrase,
          isRequired: obj.isRequired,
          isActive: true,
          assessmentsAnswer: obj.assessmentsAnswer
            ? obj.assessmentsAnswer.map((data) => {
              if (obj.assessmentAnswerTypeId === "3") {
                return {
                  order: data.order,
                  answer: data.answer,
                  weight: 1,
                  value: data.value,
                  isActive: true,
                };
              }
              return data;
            })
            : [],
        };
      })
      : [];
    createAssessment(data)
      .then((res) => {
        if (isMounted()) {
          setLoading(false);
          cancelModal();
          // asessmentManageList();
          toast({ type: "success", text: "Assessment created successfully" });
        }
      })
      .catch((err) => {
        console.log(err.response);
        setLoading(false);
        toast({
          type: "error",
          text: "Something went wrong. Please try again !",
        });
      });
  };

  const editAssessment = (data) => {
    data.id = editData.id;
    data.createdDate = editData.createdDate;

    data["assessmentsQuestion"] = data.assessmentsQuestion
      ? data.assessmentsQuestion.map((obj) => {
        return obj.id
          ? {
            id: obj.id,
            order: obj.order,
            question: obj.question,
            category: obj.category,
            weight: obj.weight,
            assessmentAnswerTypeId: obj.assessmentAnswerTypeId,
            preQuestionPhrase: obj.preQuestionPhrase,
            isRequired: obj.isRequired,
            isActive: true,
            assessmentsAnswer: obj.assessmentsAnswer
              ? obj.assessmentsAnswer.map((data) => {
                if (obj.assessmentAnswerTypeId === "3") {
                  return data.id
                    ? {
                      id: data.id,
                      order: data.order,
                      answer: data.answer,
                      weight: 1,
                      value: data.value,
                      isActive: true,
                    }
                    : {
                      order: data.order,
                      answer: data.answer,
                      weight: 1,
                      value: data.value,
                      isActive: true,
                    };
                }

                return data.id
                  ? {
                    id: data.id,
                    order: data.order,
                    answer: data.answer,
                    weight: data.weight,
                    value: data.value,
                    isActive: true,
                  }
                  : {
                    order: data.order,
                    answer: data.answer,
                    weight: data.weight,
                    value: data.value,
                    isActive: true,
                  };
              })
              : [],
          }
          : {
            order: obj.order,
            question: obj.question,
            category: obj.category,
            weight: obj.weight,
            assessmentAnswerTypeId: obj.assessmentAnswerTypeId,
            preQuestionPhrase: obj.preQuestionPhrase,
            isRequired: obj.isRequired,
            isActive: true,
            assessmentsAnswer: obj.assessmentsAnswer.$values
              ? obj.assessmentsAnswer.$values.map((data) => ({
                order: data.order,
                answer: data.answer,
                weight: data.weight,
                value: data.value,
                isActive: true,
              }))
              : [],
          };
      })
      : [];
    updateAssessment(data)
      .then((res) => {
        if (isMounted()) {
          setLoading(false);
          cancelModal();
          // asessmentManageList();
          toast({ type: "success", text: "Assessment updated successfully" });
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast({
          type: "error",
          text: "Something went wrong. Please try again !",
        });
      });
  };

  const cancelModal = () => {
    reset({
      name: "",
      description: "",
      assessmentsQuestion: [],
      assessmentGroupMapping: [""],
      reminderId: "",
      resultComputationId: "",
      showThankYouPage: false,
      redirectPageId: "",
      shortDescription: "",
      longDescription: "",
      thankYouDescription: "",
      additionalInstructions: "",
      typeId:""
    });
    setEditData();
    asessmentManageList()
    onHide();
  };

  const showIntimation = (error) => {
    if (error.assessmentsQuestion) {
      // toast({
      //   type: "error",
      //   text: "Please fill all the required fields in questions tab!",
      // })
      setTabIndexNo(2);
      setTabIndexNoErrorQuestion(error.assessmentsQuestion.findIndex(item => item))
    }

  }

  return (
    <Modal
      className={loading ? "z-indexx" : ""}
      dialogClassName="create-assessment-modal"
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header>
        <div className="d-flex w-100">
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="text-white h5 ml-4"
          >
            {editMode ? "Update Assessment" : "Create New Assessment"}
          </Modal.Title>

          <div className="assessment-btns ml-auto">
            <button
              onClick={handleSubmit(submitForm, (error) =>
                error
                  ? showIntimation(error)
                  : ""
              )}
              type="button"
              className="save-btn-custom ml-3"
            >
              Save
            </button>
            <a

              className="close-modal-btn float-right mt-2"
              onClick={cancelModal}
            >
              Cancel
            </a>
          </div>
        </div>
      </Modal.Header>
      <Modal.Body className="assessment-body">
        <div className="container-fluid pb-4">
          <div className="row">
            <div className="col-10 d-flex">
              <div className="col-4">
                <div className="mb-3">
                  <p className="subHead-text-learner mb-4">Assessment Name</p>
                  <input
                    {...register("name", {
                      onChange: (e) => nameCheck(e.target.value),
                    })}
                    type="text"
                    className="form-control"
                  />

                  {errors.name?.type === "required" ? (
                    <span className="error-msg">Name required</span>
                  ) : errors.name?.type === "validate" ? (
                    <span className="error-msg">Name already exists</span>
                  ) : (
                    ""
                  )}

                  {/* <span className="error-msg">{errors.description?.name}</span> */}
                </div>
              </div>

              <div className="col-8  description-text">
                <p className="subHead-text-learner mb-4">Description</p>
                <textarea
                  {...register("description")}
                  type="text"
                  className="form-control"
                  rows="0"

                />
                <span className="error-msg">{errors.description?.message}</span>
              </div>
            </div>
          </div>
        </div>

        <Tabs className="assessment-tabs" selectedIndex={tabIndexNo}
          onSelect={(index) => setTabIndexNo(index)}>
          <TabList>
            <Tab>SETTINGS</Tab>
            <Tab>INTRODUCTION</Tab>
            <Tab>QUESTIONS</Tab>
            <Tab>THANK YOU</Tab>
          </TabList>

          <TabPanel>
            <AssessmentSettings
              register={register}
              errors={errors}
              groupList={groupList}
              reminderOptions={reminderOptions}
              computationList={computationList}
              redirectionList={redirectionList}
              checkedGroups={checkedGroups}
              setCheckedGroups={setCheckedGroups}
              editData={editData}
              AssessmentTypeList={AssessmentTypeList}
            />
          </TabPanel>

          <TabPanel>
            <AssessmentIntro register={register} />
          </TabPanel>

          <TabPanel>
            <AssessmentQuestionTab
              answerTypes={answerTypes}
              useFieldArray={useFieldArray}
              {...{
                control,
                register,
                getValues,
                setValue,
                watch,
                errors,
                setError,
                clearErrors,
              }}
              categoryList={categoryList}
              editData={editData}
              tabIndexNoErrorQuestion={tabIndexNoErrorQuestion}
            />
          </TabPanel>

          <TabPanel>
            <AssessmentThankYou key={1} register={register} />
          </TabPanel>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
}

export default CreateAssessmentModal;
