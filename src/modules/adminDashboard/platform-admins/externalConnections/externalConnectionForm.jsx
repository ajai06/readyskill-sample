import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useIsMounted } from "../../../../utils/useIsMounted";
import { useToastDispatch } from "../../../../context/toast/toastContext";
import { editExternalConnection } from "../../../../services/adminServices";


function ExternalConnectionForm({
  currentExternalConnection,
  getAllExternalConnectionsList,
  setCurrentExternalConnection
}) {
  const [apiKeyShow, setApiKeyShow] = useState(false);
  const toggleInviteCodeVisiblity = () => {
    setApiKeyShow(!apiKeyShow);
  };

  useEffect(() => {
    if (currentExternalConnection) {
      patchData();
    }
    return () => {
      reset();
    };
  }, [currentExternalConnection]);



  const patchData = () => {
    clearErrors();
    setValue("id", currentExternalConnection?.id);
    setValue(
      "connectionName",
      currentExternalConnection?.connectionName
        ? currentExternalConnection?.connectionName
        : ""
    );
    setValue(
      "description",
      currentExternalConnection?.description
        ? currentExternalConnection?.description
        : ""
    );
    setValue(
      "baseUrl",
      currentExternalConnection?.baseUrl
        ? currentExternalConnection?.baseUrl
        : ""
    );
    setValue("apiKey", currentExternalConnection?.apiKey);
    setValue("logo", currentExternalConnection?.logo);
    setValue("swaggerSupport", currentExternalConnection?.swaggerSupport);
  };

  const toast = useToastDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    clearErrors,
    watch,
  } = useForm({ mode: "onChange" });
  const isMounted = useIsMounted();

  const connectionUpdate = (data) => {
    editExternalConnection(data)
      .then((res) => {
        toast({ type: "success", text: "Data updated successfully!" });
        if (isMounted()) {
          getAllExternalConnectionsList();
          setCurrentExternalConnection(undefined)
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  //watch variable
  const apiUrl = watch("baseUrl")?.length? watch("baseUrl") : (currentExternalConnection?.baseUrl);

  const openUrl = ()=>{
      if (apiUrl) {
        window.open(apiUrl, "_blank");
      }
    
  }


  return (
    <React.Fragment>
      <div className="pl-2 mt-4">
        <div className="mb-2">
          <p className="inner-head mb-0 pb-1 text-uppercase">Name </p>
          <input
            className="custom-input cursor-text w-50 mt-0"
            {...register("connectionName", { required: true })}
          />
          {errors.connectionName?.type === "required" && (
            <span className="error-msg">
              Name is required
              <br />
            </span>
          )}
        </div>
        <div className="mb-5">
          <p className="inner-head mb-0 pb-1 text-uppercase">Description</p>
          <textarea
            className="custom-input cursor-text w-50 mt-0"
            {...register("description", { required: true })}
          />
          {errors.description?.type === "required" && (
            <span className="error-msg">
              Description is required
              <br />
            </span>
          )}
        </div>

        <div className="mb-2">
          <p className="inner-head mb-0 pb-1 text-uppercase">base url</p>
          <div className="d-flex">
            <input
              className="custom-input cursor-text w-50 mt-0"
              {...register("baseUrl", {
                required: true,
                pattern: /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,})+$/
              })}
            />
            {errors.baseUrl?.type !== "pattern" && (apiUrl?.length) && errors.baseUrl?.type !== "required"  && (
                <span
                  className="material-icons curosr-pointer open-new list-fun-btns mx-2 mt-1 custom-tooltip"
                  onClick={openUrl}
                >
                  <span className='tooltiptext'>Open directory</span>
                  open_in_new
                </span>
            )}
           
        </div>
        {errors.baseUrl?.type === "required" ? (
              <p className="error-msg">
                 Link is required
                <br />
              </p>
            ) : errors.baseUrl?.type === "pattern" ? (
              <span className="error-msg">
                    Invalid URL
                <br />
              </span>
            ) : (
              ""
            )}
        <div className="mb-3 api-key">
          <p className="inner-head mb-0 pb-1 text-uppercase">api key</p>
          <div className="position-relative">
          <input
            className="custom-input cursor-text w-50 mt-0"
            type={apiKeyShow ? "text" : "password"}
            {...register("apiKey", { required: true })}
          />
          <span
            className="material-icons eye-icon-external mr-0 "
            onClick={toggleInviteCodeVisiblity}
          >
            {!apiKeyShow ? "visibility_off" : "visibility"}
          </span>
          </div>
          {errors.apiKey?.type === "required" && (
            <span className="error-msg">
              API Key is required
              <br />
            </span>
          )}
        </div>
        <div className="form-check mb-3">
            <label className="custom-control overflow-checkbox">
              <input type="checkbox" {...register("swaggerSupport")} className="form-check-input overflow-control-input" />
              <span className="overflow-control-indicator"></span>
            </label>
            <label className="form-check-label subText" htmlFor="exampleCheck1">Swagger Support</label>
          </div>
      </div>
      <div className="text-right w-100 mt-5 mb-3 mr-4">
        <button className="close-modal-btn mt-2" onClick={()=>setCurrentExternalConnection(undefined)}>
          Cancel
        </button>
        <button
          className="save-btn-custom ml-3"
          disabled=""
          onClick={handleSubmit(connectionUpdate)}
        >
          Save
        </button>
      </div>
      </div>
    </React.Fragment>
  );
}

export default ExternalConnectionForm;
