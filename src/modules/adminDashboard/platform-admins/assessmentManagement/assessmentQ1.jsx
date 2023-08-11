import React from "react";
import { useEffect } from "react";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import CreatableSelect from "react-select/creatable";

import SliderAnswers from "./sliderAnswers";
import MultipleChoiceOptions from "./multipleChoiceOptions";
import { useState } from "react";
import ConfirmationModal from "../../../../sharedComponents/confirmationModal/confirmationModal";

function AssessmentQuestion({
  register,
  control,
  index,
  deleteForm,
  getValues,
  watch,
  remove,
  errors,
  setValue,
  answerTypes,
  categoryList,
  clearErrors,
  setError,
  editData,
}) {
  // useEffect(() => {
  //   setValue(`assessmentsQuestion.${index}.assessmentAnswerTypeId`, "1");
  // }, []);

  // watch to enable re-render when ticket number is changed
  const answerTypeId = watch(
    `assessmentsQuestion.${index}.assessmentAnswerTypeId`
  );
  const conditions = watch(`assessmentsQuestion.${index}.addConditions`);

  const [categoryListFiltered, setCategoryListFiltered] = useState([]);
  const [category, setCategory] = useState(null);
  const [deleteModalShow, setDeleteModalShow] = useState(false);

  useEffect(() => {
    let list = [];
    categoryList.map((item, index) => list.push({ value: item, label: item }));
    setCategoryListFiltered(list);
    if (getValues(`assessmentsQuestion`)[index].category) {
      let categoryTemp = getValues(`assessmentsQuestion`)[index].category;
      if (categoryTemp)
        setCategory({ value: categoryTemp, label: categoryTemp });
    }
  }, []);

  useEffect(() => {
    if (editData) {
      let categoryTemp = getValues(`assessmentsQuestion`)[index].category;
      if (categoryTemp)
        setCategory({ value: categoryTemp, label: categoryTemp });
    }
  }, [editData]);

  const handleChange = (selectedOption) => {
    if (selectedOption) {
      setCategory(selectedOption);
      setValue(`assessmentsQuestion.${index}.category`, selectedOption.value);
      clearErrors(`assessmentsQuestion.${index}.category`);
    } else {
      setCategory(null);
      setError(`assessmentsQuestion.${index}.category`, { type: "required" });
      setValue(`assessmentsQuestion.${index}.category`, null);
    }
  };

  const colourStyles = {
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      // const color = chroma(data.color);
      console.log({ data, isDisabled, isFocused, isSelected });
      return {
        ...styles,
        backgroundColor: isFocused ? "#2647a3" : null,
        backgroundColor: "#181633",
        color: "#f0f0f0",
        backgroundColor: isSelected ? "#2647a3" : null,  
         
      };
    }
  };

  return (
    <>
      <FormProvider {...register}>
        {/* <ConfirmationModal
          show={deleteModalShow}
          actionText={"delete this question?"}
          actionButton="Delete"
          btnClassName="btn-danger"
          onHide={() => setDeleteModalShow(false)}
          onAction={() => {
            deleteForm(index);
            setDeleteModalShow(false);
          }}
        /> */}
        <form>
          <div className="d-flex bb-1 pb-2">
            <p className="text-white h5 pl-2 ">Question {index+1}</p>
            {/* <span
              onClick={() => setDeleteModalShow(true)}
              className="material-icons delete-btn-q mr-0 ml-auto" 
           
            >
              delete
            </span> */}
          </div>

          <div className="container-fluid py-2">
            <div className="row">
              <p className="subHead-text-learner mb-2 mt-3 pl-0 text-uppercase">
                Pre-question Phrase
              </p>
              <textarea
                {...register(`assessmentsQuestion.${index}.preQuestionPhrase`)}
                className="form-control w-50 mb-0"
                rows="2"
                placeholder={`Optional (i.e. "I would like to...")`}
              ></textarea>
              <p className="subHead-text-learner mb-2 mt-4 pl-0 text-uppercase">
                Question {index + 1}
              </p>
              <textarea
                {...register(`assessmentsQuestion.${index}.question`)}
                className="form-control mb-0 w-75"
                rows="4"
                placeholder="Type here"
              ></textarea>
              
                <span className="error-msg pl-0">{errors?.assessmentsQuestion?.[index]?.question?.message}</span>
              
              <div className="row px-0">
                <div className="col-12">
                  <p className="subHead-text-learner mb-2 mt-3 pl-0 text-uppercase">
                    Question {index + 1} Settings
                  </p>
                </div>

                <div className="col-4">
                  <div className="d-flex">
                    <div className="px-0 py-1">
                      <div className="form-check filter-checkboxes">
                        <label className="custom-control overflow-checkbox">
                          <input
                            className="form-check-input career-checkbox overflow-control-input"
                            type="checkbox"
                            {...register(
                              `assessmentsQuestion.${index}.isRequired`
                            )}
                          />
                          <span className="overflow-control-indicator"></span>
                        </label>
                        <label className="form-check-label text-5"></label>
                      </div>
                    </div>
                    <div className="px-0 py-1">
                      <p className="text-white d-grid pl-2 mb-3">Mandatory</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row px-0 bb-1 pb-4">
                <div className="col-2">
                  <label
                    className="form-label text-white"
                    htmlFor="weight"
                  >
                    weight
                  </label>
                  <input
                    id="weight"
                    type="number"
                    className="form-control mb-0"
                    {...register(`assessmentsQuestion.${index}.weight`, {
                      // required: true,
                    })}
                  />
                
                    <span className="error-msg">{ errors?.assessmentsQuestion?.[index]?.weight?.message}</span>
                 
                </div>
                <div className="col-4">
                  <label
                    className="form-label text-white"
                    htmlFor="Question Category"
                  >
                    Question Category
                  </label>

                  <div className="">
                    <CreatableSelect
                      {...register(`assessmentsQuestion.${index}.category`)}
                      value={category}
                      isClearable
                      onChange={handleChange}
                      options={categoryListFiltered}
                      styles={colourStyles}
                      
                    />
                      <span className="error-msg">{ errors?.assessmentsQuestion?.[index]?.category?.message}</span>
                  </div>
                </div>
              </div>
              <div className="col-12 pl-0">
                <div className="">
                  <p className="subHead-text-learner text-uppercase text-nowrap mt-3 mb-2">
                    Answer type :
                  </p>
                  <div className="custom-selector w-50">
                  <select
                    id="state"
                    className=" form-control  text-capitalize caseworker-select select-box w-100"
                    {...register(
                      `assessmentsQuestion.${index}.assessmentAnswerTypeId`
                    )}
                  >

                    <option className="caseworker-droplist text-capitalize" value="" defaultValue>
                      Select your option
                    </option>
                    {answerTypes?.map((type) => (
                      <option
                        key={type.id}
                        className="caseworker-droplist text-capitalize"
                        value={type.id}
                      >
                        {type.name}
                      </option>
                    ))}
                  </select>
                  </div>
                  <span className="error-msg">{ errors?.assessmentsQuestion?.[index]?.assessmentAnswerTypeId?.message}</span>
                </div>
              </div>
              <div className="col-12 pl-0">
                {answerTypeId && parseInt(answerTypeId) !== 3 && (
                  <MultipleChoiceOptions
                    nestIndex={index}
                    {...{
                      control,
                      register,
                      watch,
                      errors,
                      getValues,
                      setValue,
                    }}
                    answerTypeId={getValues(`assessmentsQuestion.${index}.assessmentAnswerTypeId`)}
                    answerType={"multiple"}
                    editData={editData}
                  />
                )}

                {answerTypeId && parseInt(answerTypeId) === 3 && (
                  <SliderAnswers
                    nestIndex={index}
                    {...{
                      control,
                      register,
                      watch,
                      setValue,
                      getValues,
                      errors,
                    }}
                    answerTypeId={getValues(`assessmentsQuestion.${index}.assessmentAnswerTypeId`)}
                    answerType={"slider"}
                    editData={editData}
                  />
                )}
              </div>
              <div className="pl-0 bt-1">
                <div className="mb-3 pb-0">
                  <p className="subHead-text-learner text-uppercase text-nowrap mt-3">
                    Conditional Logic{" "}
                    {/* <span className="material-icons mt-02 ml-2">help_outline</span> */}
                  </p>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      id="switch"
                      {...register(
                        `assessmentsQuestion.${index}.addConditions`,
                        {}
                      )}
                    />
                    <label htmlFor="switch">Toggle</label>
                  </div>
                </div>

                {/* {getValues(`assessmentsQuestion.${index}.addConditions`) && (
                  <>
                    <div className="d-flex mb-3 mt-4">
                      <select
                        id="state"
                        defaultValue="Show"
                        className=" form-control  text-capitalize caseworker-select select-box w-25"
                      >
                        <option
                          value=""
                          className="caseworker-droplist text-capitalize"
                        >
                          Show
                        </option>
                        <option
                          value=""
                          className="caseworker-droplist text-capitalize"
                        >
                          Hide
                        </option>
                      </select>
                      <span className="subText font-italic ml-3">
                        this question if
                      </span>
                    </div>

                    <div className="d-flex">
                      <select
                        id="state"
                        defaultValue="Previous question"
                        className=" form-control  text-capitalize caseworker-select select-box "
                      >
                        <option
                          value=""
                          className="caseworker-droplist text-capitalize"
                        >
                          Previous question
                        </option>
                      </select>

                      <select
                        id="state"
                        defaultValue="is"
                        className=" form-control  text-capitalize caseworker-select select-box mx-3"
                      >
                        <option
                          value=""
                          className="caseworker-droplist text-capitalize"
                        ></option>
                        <option className="caseworker-droplist text-capitalize">
                          is
                        </option>
                        <option className="caseworker-droplist text-capitalize">
                          is not
                        </option>
                        <option className="caseworker-droplist text-capitalize">
                          empty
                        </option>
                      </select>

                      <select
                        id="state"
                        defaultValue="Select- choice"
                        className=" form-control  text-capitalize caseworker-select select-box "
                      >
                        <option
                          value=""
                          className="caseworker-droplist text-capitalize"
                        >
                          Answer 1
                        </option>
                        <option className="caseworker-droplist text-capitalize">
                          Answer 2
                        </option>
                      </select>

                      <button className="teal-btn mx-3">AND</button>
                      <span
                        className="material-icons delete-btn mt-2"
                      
                      >
                        delete
                      </span>
                    </div>
                  </>
                )} */}
              </div>

              {getValues(`assessmentsQuestion.${index}.addConditions`) && (
                <>
                  <div className="d-flex pl-0">
                    <div>
                      <input className="custom-radio" name="logicShowHide" id="logicShow" type="radio" />
                      <label htmlFor="logicShow" className="radio">Show</label>
                    </div>
                    <div className="ml-3">
                      <input className="custom-radio" name="logicShowHide" id="logicHide" type="radio" />
                      <label htmlFor="logicHide" className="radio">Hide</label>
                    </div>
                  </div>
                  <p className="text-5 mt-2 pl-0">This question if..</p>
                  <div className="d-flex pl-0">
                    <select
                      id="state"
                      defaultValue="Previous question"
                      className=" form-control  text-capitalize caseworker-select select-box "
                    >
                      <option
                        value=""
                        className="caseworker-droplist text-capitalize"
                      >
                        Previous question
                      </option>
                    </select>

                    <select
                      id="state"
                      defaultValue="is"
                      className=" form-control  text-capitalize caseworker-select select-box mx-3"
                    >
                      <option
                        value=""
                        className="caseworker-droplist text-capitalize"
                      ></option>
                      <option className="caseworker-droplist text-capitalize">
                        is
                      </option>
                      <option className="caseworker-droplist text-capitalize">
                        is not
                      </option>
                      <option className="caseworker-droplist text-capitalize">
                        empty
                      </option>
                    </select>

                    <select
                      id="state"
                      defaultValue="Select- choice"
                      className=" form-control  text-capitalize caseworker-select select-box "
                    >
                      <option
                        value=""
                        className="caseworker-droplist text-capitalize"
                      >
                        Answer 1
                      </option>
                      <option className="caseworker-droplist text-capitalize">
                        Answer 2
                      </option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  );
}

export default AssessmentQuestion;
