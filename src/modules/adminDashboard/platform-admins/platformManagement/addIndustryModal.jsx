import React from "react";
import { useEffect } from "react";
import { Button, CloseButton, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
//context
import { UserAuthState } from "../../../../context/user/userContext";
import { useToastDispatch } from "../../../../context/toast/toastContext";

//services
import {
  createIndustry,
  editIndustry,
  checkIndustryForDuplicate,
} from "../../../../services/adminServices";
import { useState } from "react";

function AddIndustryModal({
  onHide,
  fetchOrganizations,
  editData,
  getAllIndustry,
  ...props
}) {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    onetCode: Yup.string().required("ONET Code is required"),
  });
  const formOptions = {
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  };
  const {
    register,
    getValues,
    resetField,
    setError,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm(formOptions);
  const userState = UserAuthState();
  const toast = useToastDispatch();
  const [existingObject, setExistingObject] = useState([]);

  useEffect(() => {
    patchData();
  }, [editData]);

  const hideModal = () => {
    resetField("name");
    resetField("onetCode");
    resetField("isEnabled");
    resetField("isActive");
    resetField("applicationUserId");
    onHide();
  };
  const submitHandler = (data) => {
    !editData ? addIndustryHandler(data) : editIndustryHandler(data);
  };

  const addIndustryHandler = (data) => {
    createIndustry(data)
      .then((res) => {
        onHide();
        resetField("name");
        resetField("onetCode");
        resetField("isEnabled");
        resetField("isActive");
        resetField("applicationUserId");
        getAllIndustry();
        toast({ type: "success", text: "Industry added successfully" });
      })
      .catch((err) => console.log(err));
  };

  const editIndustryHandler = (data) => {
    data["id"] = editData.id;
    editIndustry(data)
      .then((res) => {
        onHide();
        getAllIndustry();
        toast({ type: "success", text: "Industry updated successfully" });
      })
      .catch((err) => console.log(err));
  };

  const patchData = () => {
    if (editData) {
      setValue("name", editData.name);
      setValue("onetCode", editData.onetCode);
      setValue("isEnabled", editData.isEnabled);
    } else {
      // resetField("name");
      // resetField("onetCode");
      // resetField("isEnabled");
    }
    setValue("isActive", true);
    setValue("applicationUserId", userState.user.id);
  };

  const checkIndustryExisting = async () => {
    let oNet = getValues("onetCode").length ? getValues("onetCode") : undefined;
    let industryName = getValues("name").length ? getValues("name") : undefined;
    checkIndustryForDuplicate(oNet, industryName)
      .then((res) => {
        setExistingObject(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (existingObject.length && !editData) {
      if (existingObject?.some((obj) => obj.name === getValues("name"))) {
        setError("name", { message: "Name already exists" });
      }
      if (
        existingObject?.some((obj) => obj.onetCode === getValues("onetCode"))
      ) {
        setError("onetCode", { message: "ONET Code already exists" });
      }
    } else if (existingObject.length && editData) {
      if (
        existingObject?.some(
          (obj) => obj.id !== editData.id && obj.name === getValues("name")
        )
      ) {
        setError("name", { message: "Name already exists" });
      }
      if (
        existingObject?.some(
          (obj) =>
            obj.id !== editData.id && obj.onetCode === getValues("onetCode")
        )
      ) {
        setError("onetCode", { message: "ONET Code already exists" });
      }
    }
  }, [existingObject]);

  const debounce = (func, delay) => {
    let debounceTimer;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const onOptimisedHandleChange = debounce(checkIndustryExisting, 500);

  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      className="org-add-modal add-industry-modal"
    >
      <Modal.Header>
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="subHead-text-learner mt-3"
        >
          {!editData ? "ADD NEW INDUSTRY" : "EDIT INDUSTRY"}
        </Modal.Title>
        <CloseButton
          onClick={hideModal}
          className="modal-close-icon btn-light"
        />
      </Modal.Header>
      <Modal.Body>
        <div className="col mb-2">
          <label className="form-label inner-sub" htmlFor="onetCode">
            ONET Code{" "}
          </label>
          <span className="d-flex">
            <input
              {...register("onetCode", {
                onChange: onOptimisedHandleChange,
              })}
              type="text"
              id="onetCode"
              className="form-control"
            />
          </span>

          <span className="error-msg">{errors?.onetCode?.message}</span>
        </div>
        <div className="col">
          <label className="form-label inner-sub" htmlFor="name">
            Name{" "}
          </label>
          <span className="mb-3">
            <input
              {...register("name", {
                onChange: onOptimisedHandleChange,
              })}
              type="text"
              id="name"
              className="form-control"
            />
            <span className="error-msg mb-3">{errors?.name?.message}</span>
          </span>
          
        </div>
        <div className="col mt-3">
          <div className="form-check mb-2">
            <label className="custom-control overflow-checkbox">
              <input
                type="checkbox"
                {...register("isEnabled")}
                id="isEnabled"
                className="form-check-input overflow-control-input"
              />
              <span className="overflow-control-indicator"></span>
            </label>
            <label className="form-check-label subText" htmlFor="isEnabled">
              Enabled{" "}
            </label>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <a className="close-modal-btn" onClick={hideModal}>
          Cancel
        </a>
        <Button
          onClick={
            Object.keys(errors).length === 0
              ? handleSubmit(submitHandler)
              : undefined
          }
          className="save-btn-custom"
        >
          {!editData ? "ADD" : "SAVE"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddIndustryModal;
