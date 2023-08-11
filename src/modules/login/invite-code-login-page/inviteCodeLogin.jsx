import React, { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";

// import { inviteCodeVerify,setToken, getIpAddress, external_register, external_login } from "../../../services/apiServices";

import { setToken } from "../../../services/apiServices";

import {
  external_login,
  external_register,
  getIpAddress,
  inviteCodeVerify,
} from "../../../services/userManagementServices";

import { UserAuthDispatch } from "../../../context/user/userContext";
import { useToastDispatch } from "../../../context/toast/toastContext";

import IpRestrictModal from "../../../sharedComponents/ipRestrict/ipRestrict";
import { useIsMounted } from "../../../utils/useIsMounted";
import "./inviteCodeLogin.scss";

import logo from "../../../assets/img/logos/readySkill-light.png";

function InviteCodeLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const toast = useToastDispatch();
  const userDispatch = UserAuthDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const [invalidInviteCode, setInvalidInviteCode] = React.useState(false);
  const [ipError, setIpError] = React.useState(false);
  const [ipAddress, setIpAddress] = useState("");
  const [external_signup, setExternal_Signup] = useState(false);
  const isMounted = useIsMounted();

  useEffect(() => {
    const state = location.state;
    if (state && location.state.external_login && isMounted()) {
      setExternal_Signup(true);
    }
  }, []);

  const inviteCodeSubmit = (data) => {
    setInvalidInviteCode(false);
    setIpError(false);
    let params = {
      inviteCode: data.inviteCode,
      ipAddress: ipAddress,
    };
    inviteCodeVerify(params)
      .then((res) => {
        if (res.data.isSuccess) {
          if (external_signup) {
            const { external_login_type, provider_data } = location.state;

            const obj = {};
            obj.providerName = external_login_type;
            obj.providerKey = provider_data.sub;
            obj.email = provider_data.email;
            obj.firstName = provider_data.firstName;
            obj.lastName = provider_data.lastName;
            obj.platformType = "Portal";
            obj.organizationId = res.data.id;

            external_register(obj)
              .then((res) => {
                if (res.data.isSuccess) {
                  const data = {};
                  data.providerName = external_login_type;
                  data.providerKey = provider_data.sub;
                  data.email = provider_data.email;
                  data.platformType = "Portal";
                  data.externalAuthProvider =
                    provider_data.externalAuthProvider;
                  data.externalAuthToken = provider_data.externalAuthToken;
                  data.ipAdress = ipAddress;
                  external_login(data)
                    .then((res) => {
                      if (res.data.isSuccess) {
                        const user = {
                          id: res.data.id,
                          token: res.data.token,
                          userEmail: res.data.userEmail,
                          organization: {
                            organizationId: res.data.organizationId,
                            organizationName: res.data.organizationName,
                            organizationType: res.data.organizationType,
                          },
                          firstName: res.data.firstName,
                          lastName: res.data.lastName,
                          roleName: res.data.roleName,
                        };

                        setTimeout(() => {
                          if (isMounted()) {
                            toast({
                              type: "success",
                              text: "Login successful",
                            });
                            userDispatch({ type: "LOGIN", payload: user });
                            localStorage.setItem("user", JSON.stringify(user));
                            localStorage.removeItem("externalLoginType");
                            setToken(res.data.token, res.data.id); //Will change it
                            navigate("/portal/dashboard");
                          }
                        }, 500);
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                } else {
                  toast({ type: "error", text: res.data.message });
                }
              })
              .catch((err) => {
                console.log(err.response);
              });
          } else {
            localStorage.setItem("inviteCodeRegisterOrgId", res.data.id);
            setTimeout(() => {
              if (isMounted()) {
                toast({ type: "success", text: res.data.message });
                // navigate("/portal/invite_signup",{state: { emailWithCode: false, orgId: res.data.id }});
                navigate("/portal/authorizationLimit", {
                  state: {
                    emailWithCode: false,
                    orgId: res.data.id,
                    orgData: res.data,
                  },
                });
              }
            }, 500);
          }
        } else {
          if (res.data.message === "Invalid Code") {
            setTimeout(() => {
              if (isMounted()) {
                setInvalidInviteCode(true);
                setIpError(false);
              }
            }, 500);
          }
          if (res.data.message === "IP Restricted") {
            setTimeout(() => {
              if (isMounted()) {
                setInvalidInviteCode(false);
                setIpError(true);
              }
            }, 500);
          }
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const getIp = () => {
    getIpAddress()
      .then((response) => {
        return response.json();
      })
      .then((obj) => {
        if (isMounted()) {
          setIpAddress(obj.ip);
        }
      });
  };
  useEffect(() => {
    getIp();
  }, []);

  return (
    <div className="invite-code-login-container">
      <IpRestrictModal ipError={ipError} setIpError={setIpError} />

      <div className="main-bg">
        <div className="container-fluid p-0">
          <div className="wrap-login">
            <div className="login-title login-bg">
              <div className="row readySkill-logo">
                <img src={logo} alt="logo" />
              </div>
            </div>
          </div>
        </div>
        <div className="inviteCode-container">
          <h5 className="text-center text-white mb-3 font-weight-normal">
            Sign-Up Using an Invite Code
          </h5>
          <p className="text-center signup-text">
            To sign up for the ReadySkill partner portal you must have an invite
            code from your organization administrator. If you do not have an
            invite code or your code has expired, please contact your
            organization administrator to get a new code.
          </p>
          <p className="text-center signup-text">
            This page will lock out your IP address after too many failed
            attempts.
          </p>
          <div className="form-container">
          <form
            className="login-form "
            onSubmit={handleSubmit(inviteCodeSubmit)}
          >
           
            <div className="wrap-input mb-1" data-validate="">
            <p className="signup-text mt-3 mb-2 text-left">Invite Code</p>
              <input
                className="input-items mb-2"
                type="text"
                name="text"
                placeholder="Invite Code"
                {...register("inviteCode", { required: true })}
              />
              {errors.inviteCode ? (
                <span className="error-msg">Plase enter the invite code</span>
              ) : invalidInviteCode ? (
                <span className="error-msg">
                  The code you entered is invalid or may be expired. Please
                  check the code and try again or contact your organization
                  administrator for an updated invite code.
                </span>
              ) : (
                ""
              )}
            </div>
            <div className="container-form-btn pt-2 mb-4">
              <button
                type="button"
                onClick={() => navigate("/portal/login")}
                className="btn btn-block cancel-btn"
              >
                Cancel
              </button>
              <button type="submit" className="loginButton">
                {" "}
                Submit{" "}
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InviteCodeLogin;
