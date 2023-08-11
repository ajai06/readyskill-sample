import React, { useEffect, useState, useRef } from "react";

import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from "react-router-dom";


import { useToastDispatch } from "../../context/toast/toastContext";

// import { setNewPassword } from '../../services/apiServices';

import { setNewPassword } from "../../services/userManagementServices";

import "./resetPassword.scss";

import logo from "../../assets/img/logos/readySkill-light.png";

function ResetPasswordVerifyOTP() {

  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);
  const toast = useToastDispatch();
  
  const { register, formState: { errors }, handleSubmit, watch } = useForm();

  const [otpData, setData] = useState([]);
  const [otpError, setOtpError] = useState(false);
  const [otpTimeOutError, setOtpTimeOutError] = useState(false);

  const mountedRef = useRef(false);

    useEffect(() => {
        mountedRef.current = true;

        if(mountedRef){
          if (!location.state) {
            navigate("/portal/resetPassword")
          } else {
            
            setData(location.state.data)
          }
        }
        return () => {
            mountedRef.current = false
        }
    }, []);

  const [passwordShown, setPasswordShown] = React.useState(false);
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const [confirmPasswordShown, setConfirmPasswordShown] = React.useState(false);
  const toggleConfirmPasswordVisiblity = () => {
    setConfirmPasswordShown(confirmPasswordShown ? false : true);
  };

  const submitNewPassword = (data) => {
    
    data.resetPasswordToken = otpData.resetPasswordToken;
    data.email = otpData.email;
    //We are not confirming password in UI side as per client requirement. 
    data.confirmPassword=null;
    data.platformType="Portal"

    const expiration = new Date(location.state.data.otpExpireAt);
    const now = new Date();

    if(otpData.randomOTP !== data.randomOTP){
      setOtpError(true);
      return;
    } else if (expiration.getTime() - now.getTime() < 0) {
        setOtpTimeOutError(true);
        return;

    }   else {

      
      setNewPassword(data)
        .then(res => {
          if (res.data.isSuccess) {
            toast({ type: "success", text: res.data.message })
            
            navigate("/portal/login")
          } else {
            toast({ type: "error", text: res.data.message })
            
          }
        })
        .catch(err => {
          
          console.log(err.response)
        })
    }

  }

  const productImageField = register("randomOTP", { required: true });

  const handleImageUpload = (e) =>{
    if(mountedRef){
      setOtpError(false);
      setOtpTimeOutError(false);
    }
  }

  
  return (
    <div className="reset-pass-container">
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
            <form className="loginForm" onSubmit={handleSubmit(submitNewPassword)}>
              <div className="form-group">
                <input type="text" maxLength="6" className="form-control mb-4" id="otp" placeholder="Enter OTP Received"
                  {...productImageField}
                  onChange={(e) => {
                    productImageField.onChange(e);
                    handleImageUpload(e);
                    }}
                />
              </div>
              <div className="otp-msg">
                {
                  errors.randomOTP ? <span className="error-msg">OTP required</span>
                    : otpError ? <span className="error-msg">OTP not matching</span>
                      : otpTimeOutError ? <span className="error-msg">Otp expired</span>
                        : ''
                }
              </div>
              <div className="form-group login-pass">
                <input
                  
                  className="form-control mb-2"
                  id="pwd1"
                  type={passwordShown ? "text" : "password"}
                  placeholder="Enter New Password"
                  {...register("newPassword", {
                    required: true, minLength: 8,
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,50}$/
                  })
                  }
                />
                <span className="material-icons eye-icon" onClick={togglePasswordVisiblity}>
                  {passwordShown ? 'visibility_off' : 'visibility'}
                </span>

              </div>
              <div className="otp-msg">
                {
                  errors.newPassword?.type === "required" ?
                    <span className="error-msg">Password required</span>
                    : errors.newPassword?.type === "minLength"
                      ? <span className="error-msg">Minimum 8 characters required</span>
                      : errors.newPassword?.type === "pattern"
                        ? <span className="error-msg">
                          <ul>
                            <li>Passwords must have at least one non alphanumeric character. </li>
                            <li>Passwords must have at least one lowercase ('a'-'z').</li>
                            <li>Passwords must have at least one uppercase ('A'-'Z').</li>
                            {/* <li>Passwords must be at least 8 characters.</li> */}
                            <li>Passwords must have at least one digit ('0'-'9').</li>
                          </ul>
                        </span> : ''
                }
              </div>
              {/* <div className="form-group login-pass">
                <input
                  type="password"
                  className="form-control mb-2"
                  id="pwd2"
                  type={confirmPasswordShown ? "text" : "password"}
                  placeholder="Confirm Password"
                  {...register("confirmPassword", { required: true, validate: value => value === watch("newPassword") })}
                  
                />
                <span className="material-icons eye-icon" onClick={toggleConfirmPasswordVisiblity}>
                    {confirmPasswordShown ? 'visibility' : 'visibility_off'}
                </span>
                {
                    errors.confirmPassword?.type === "required" ?
                        <span className="error-msg">Confirm password required</span>
                        : errors.confirmPassword?.type === "validate" ?
                            <span className="error-msg">Password not matching</span> : ''
                }
              </div> */}
              <div className="reset-buttons mb-4">

                <button type="button" onClick={() => navigate(-1)} className="btn btn-block cancel-btn">Cancel</button>
                <button type="submit" className="btn btn-default submit-button">
                  Reset
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ResetPasswordVerifyOTP;
