import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useToastDispatch } from "../../../../context/toast/toastContext";
import { UserAuthState } from "../../../../context/user/userContext";

import {
  emailConnectorTest,
  getApiConnectorDetails,
  saveEmailConnectorDetails,
  updateFederatedLoginTypes,
} from "../../../../services/adminServices";
import { getExternalLoginTypes } from "../../../../services/organizationServices";
import { useIsMounted } from "../../../../utils/useIsMounted";

function PlatformTab() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm();
  const isMounted = useIsMounted();
  const [externalLoginListMobile, setExternalLogins] = useState([]);
  const [externalLoginListPortal, setExternalLoginsPortal] = useState([]);
  const [emailConnectorData, setEmailConnectorData] = useState([]);
  const toast = useToastDispatch();
  const userState = UserAuthState();
  const authentication = watch("isAuthenticated");

  useEffect(() => {
    getExternalLoginTypeDetails();
    getEmailConnectorData();
  }, [])

  const getEmailConnectorData = () => {
    getApiConnectorDetails()
      .then((res) => {
        console.log(res);
        if (res.data?.length > 0) {
          if (isMounted()) {
            let response = res.data;
            setEmailConnectorData(response);
            patchData(res.data);
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const patchData = (data) => {
    setValue("serverName", data[0].serverName);
    setValue("serverPort", data[0].serverPort);
    setValue("isAuthenticated", data[0].isAuthenticated);
    setValue("identityName", data[0].identityName);
    setValue("password", data[0].password);
  };

  // let mobileExcludeList = ["Microsoft (Azure AD)", "Microsoft (Office 365)"];
  let mobileExcludeList = ["Microsoft (Azure AD)", "Microsoft (Office 365)"];
  let portalExcludeList = [
    "Facebook",
    "Twitter",
    "Microsoft (Live)",
    // "Microsoft (Office 365)",
  ];

  const getExternalLoginTypeDetails = () => {
    getExternalLoginTypes()
      .then((res) => {
        if (res.data) {
          if (isMounted()) {
            let mobileList = res.data.filter((item) => {
              return !mobileExcludeList.includes(item.typeNameDescription);
            });
            let portalList = res.data.filter((item) => {
              return !portalExcludeList.includes(item.typeNameDescription);
            });
            let localData = mobileList.find((obj) => obj.typeName === "Local");

            if (mobileList.filter((obj) => obj.isMobile)?.length === 0) {
              upDateAtlestOneLoginOption(localData.id, "Mobile", true);
            }
            if (portalList.filter((obj) => obj.isPortal)?.length === 0) {
              upDateAtlestOneLoginOption(localData.id, "Portal", true);
            }
            setExternalLogins(mobileList);
            setExternalLoginsPortal(portalList);
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const upDateAtlestOneLoginOption = (loginTypeId, editingField, isActive) => {
    let params = {
      externalLoginTypeId: loginTypeId,
      editingField: editingField,
      isActive: isActive,
    };
    updateFederatedLoginTypes(loginTypeId, params).then((res) => {
      if (res) {
        if (isMounted()) {
          getExternalLoginTypeDetails();
        }
      }
    });
  };

  const updateFederatedLoginTypesData = (e, data, type) => {
    if (
      type === "Portal" &&
      externalLoginListPortal.filter((obj) => obj.isPortal)?.length === 1 &&
      !e.target.checked
    ) {
      toast({
        type: "warning",
        text: "You should have atleast one Authentication Option selected.",
      });
      return;
    }
    if (
      type === "Mobile" &&
      externalLoginListMobile.filter((obj) => obj.isMobile)?.length === 1 &&
      !e.target.checked
    ) {
      toast({
        type: "warning",
        text: "You should have atleast one Authentication Option selected.",
      });
      return;
    }
    let params = {
      externalLoginTypeId: data.id,
      editingField: type,
      isActive: e.target.checked,
    }
    updateFederatedLoginTypes(data.id, params).then((res) => {
      if (res) {
        if (isMounted()) {
          getExternalLoginTypeDetails();
        }
      }
    });
  };

  const saveEmailConnector = (data) => {
    data["applicationUserId"] = userState.user.id;
    if (emailConnectorData[0]?.id) {
      data["id"] = emailConnectorData[0].id;
    }
    saveEmailConnectorDetails(data)
      .then((res) => {
        if (res.data.isSuccess) {
          getEmailConnectorData();
          toast({
            type: "success",
            text: res.data.message,
          });
        } else {
          toast({
            type: "error",
            text: res.data.message,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  const TestEmailConnector = (data) => {
    data["applicationUserId"] = userState.user.id;
    emailConnectorTest(data)
      .then((res) => {
        if (res.data.isSuccess) {
          toast({ type: "success", text: res.data.message });
        } else {
          toast({ type: "error", text: res.data.message });
        }
      })
      .catch(err => console.log(err))
  }


  return (
    <div className="card-body platform-settings">
      <div className="d-flex">
        <div className="col-6">
          <p className="subHead-text-learner mb-4 text-uppercase mt-3">
            Federated Identity - Mobile App
          </p>
          {externalLoginListMobile?.length > 0 &&
            externalLoginListMobile.map((obj) => (
              <div className="" key={obj.id}>
                <div className="form-check mb-2">
                  <label className="custom-control overflow-checkbox">
                    <input
                      type="checkbox"
                      // disabled={
                      //   externalLoginListMobile.filter((obj) => obj.isMobile)
                      //     ?.length === 1 &&
                      //   externalLoginListMobile.find((obj) => obj.isMobile)
                      //     .typeName === obj.typeName
                      //     ? true
                      //     : false
                      // }
                      checked={obj.isMobile}
                      id={obj.id}
                      onChange={(e) =>
                        updateFederatedLoginTypesData(e, obj, "Mobile")
                      }
                      className="form-check-input overflow-control-input"
                    />
                    <span className="overflow-control-indicator"></span>
                  </label>
                  <label className="form-check-label subText" htmlFor={obj.id}>
                    {obj.typeNameDescription}
                  </label>
                </div>{" "}
              </div>
            ))}

          <p className="subHead-text-learner mb-4 text-uppercase mt-5">
            Federated Identity - Partner Portal
          </p>
          {externalLoginListPortal?.length > 0 &&
            externalLoginListPortal.map((obj) => (
              <div className="" key={obj.id}>
                <div className="form-check mb-2">
                  <label className="custom-control overflow-checkbox">
                    <input
                      type="checkbox"
                      // disabled={
                      //   externalLoginListPortal.filter((obj) => obj.isPortal)
                      //     ?.length === 1 &&
                      //   externalLoginListPortal.find((obj) => obj.isPortal)
                      //     .typeName === obj.typeName
                      //     ? true
                      //     : false
                      // }
                      checked={obj.isPortal}
                      id={obj.id}
                      onChange={(e) =>
                        updateFederatedLoginTypesData(e, obj, "Portal")
                      }
                      className="form-check-input overflow-control-input"
                    />
                    <span className="overflow-control-indicator"></span>
                  </label>
                  <label className="form-check-label subText" htmlFor={obj.id}>
                    {obj.typeNameDescription}
                  </label>
                </div>
              </div>
            ))}
        </div>
        <div className="col-6">
          <p className="subHead-text-learner mb-4 text-uppercase mt-3">
            E-Mail Connector
          </p>
          <div className="mb-2">
            <p className="inner-head mb-0 pb-1 text-uppercase">
              Server Name or IP
            </p>
            <input
              {...register("serverName", { required: true })}
              className="custom-input cursor-text w-50 mt-0"
            />
          </div>
          {errors.serverName && (
            <span className="error-msg">This field is required</span>
          )}
          <div className="mb-3">
            <p className="inner-head mb-0 pb-1 text-uppercase">server port</p>
            <input
              {...register("serverPort", { required: true })}
              className="custom-input cursor-text w-50 mt-0"
            />
          </div>
          {errors.serverPort && (
            <span className="error-msg">This field is required</span>
          )}
          <div className="form-check mb-3">
            <label className="custom-control overflow-checkbox">
              <input
                type="checkbox"
                {...register("isAuthenticated")}
                className="form-check-input overflow-control-input"
              />
              <span className="overflow-control-indicator"></span>
            </label>
            <label className="form-check-label subText" htmlFor="exampleCheck1">
              Requires Authentication
            </label>
          </div>
          {authentication && (
            <div>
              <div className="mb-2">
                <p className="inner-head mb-0 pb-1 text-uppercase">identity</p>
                <input
                  {...register("identityName", {
                    required: authentication ? true : false,
                  })}
                  className="custom-input cursor-text w-50 mt-0"
                />
              </div>
              {errors.identityName && (
                <span className="error-msg">This field is required</span>
              )}
              <div className="mb-3">
                <p className="inner-head mb-0 pb-1 text-uppercase">password</p>
                <div>
                  <input
                    type="password"
                    {...register("password", {
                      required: authentication ? true : false,
                    })}
                    id="platform-password"
                    className="custom-input cursor-text w-50 mt-0"
                  />
                </div>
              </div>
              {errors.identityName && (
                <span className="error-msg">This field is required</span>
              )}
            </div>
          )}

          <div className="text-right w-100 mt-5 mb-3 mr-4">
            <button
              type="button"
              className="test-btn"
              onClick={handleSubmit(TestEmailConnector)}
            >
              Test
            </button>
            {
              authentication && <button
                type="button"
                className="save-btn-custom ml-2"
                onClick={handleSubmit(saveEmailConnector)}
              >
                Save
              </button>
            }

          </div>
        </div>
      </div>
    </div>
  );
}

export default PlatformTab;
