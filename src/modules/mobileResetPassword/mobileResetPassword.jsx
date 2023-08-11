import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { resetPasswordByLearner } from "../../services/userManagementServices";

//context
import { useToastDispatch } from "../../context/toast/toastContext";

import "./mobileResetPassword.scss";
import logo from "../../assets/img/logos/readySkill-light.png";

function MobileResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const location = useLocation();

  const params = new URLSearchParams(location.search);

  const userId = params.get("userId");

  const toast = useToastDispatch();

  const navigate = useNavigate();

  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const [passwordShown, setPasswordShown] = React.useState(false);
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const resetPasswordSubmit = (data) => {
    data["applicationUserId"] = userId;
    data["confirmPassword"] =data.newPassword;
    
    resetPasswordByLearner(data)
      .then((res) => {
        if (res.data.isSuccess) {
          setTimeout(() => {
            if (mountedRef) {
              navigate("/portal/login");

              toast({ type: "success", text: res.data.message, timeout: 7000 });
            }
          }, 500);
        } else {
          if (mountedRef) {
            toast({ type: "error", text: res.data.message });
          }
        }
      })
      .catch((err) => {
        console.log(err.response);

        if (mountedRef) {
          if (err.response.data) {
            toast({ type: "error", text: err.response.data.message });
          } else {
            toast({ type: "error", text: err.response.statusText });
          }
        }
      });
  };

  return (
    <div>
      <div className="mobile-reset-pass-container">
        <div>
          <div className="resetPass-container">
            <div className="container-fluid gradient">
            <div className="wrap-login">
              <div className="login-title login-bg">
              <div className="row readySkill-logo">
               <img src={logo} alt="logo" />
               </div>
              </div>
            </div>
          </div>

          <div className="container-fluid formBG">
          <h5 className="text-center text-white mb-3 font-weight-normal">
          Reset Password
          </h5>
              <form
                className="loginForm"
                onSubmit={handleSubmit(resetPasswordSubmit)}
              >
                <div className="form-group login-pass">
                  <input
                    type={passwordShown ? "text" : "password"}
                    className="form-control mb-2"
                    id="pwd1"
                    placeholder="New Password"
                    name="newPassword"
                    {...register("newPassword", {
                      required: true,
                      minLength: 8,
                      pattern:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,50}$/,
                    })}
                  />
                  <span
                    className="material-icons eye-icon"
                    onClick={togglePasswordVisiblity}
                  >
                    {passwordShown ? "visibility_off" : "visibility"}
                  </span>
                </div>

                {errors.newPassword?.type === "required" ? (
                  <span className="error-msg">Password required</span>
                ) : errors.newPassword?.type === "minLength" ? (
                  <span className="error-msg">
                    Minimum 8 characters required
                  </span>
                ) : errors.newPassword?.type === "pattern" ? (
                  <span className="error-msg">
                    <ul>
                      <li>
                        Passwords must have at least one non alphanumeric
                        character.{" "}
                      </li>
                      <li>
                        Passwords must have at least one lowercase ('a'-'z').
                      </li>
                      <li>
                        Passwords must have at least one uppercase ('A'-'Z').
                      </li>
                      {/* <li>Passwords must be at least 8 characters.</li> */}
                      <li>Passwords must have at least one digit ('0'-'9').</li>
                    </ul>
                  </span>
                ) : (
                  ""
                )}


                <div className="reset-buttons mb-4">
                  <button type="button" className="btn btn-block cancel-btn" onClick={() => navigate("/portal/login")}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-default submit-button"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileResetPassword;
