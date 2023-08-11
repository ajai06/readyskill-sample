import React, { useState, useEffect } from "react";

import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { useToastDispatch } from '../../context/toast/toastContext';

// import { resetPasswordSentOtp, getIpAddress } from '../../services/apiServices';

import { resetPasswordSentOtp,  getIpAddress } from "../../services/userManagementServices";
import { useIsMounted } from '../../utils/useIsMounted';
import IpRestrictModal from "../../sharedComponents/ipRestrict/ipRestrict";
import "./resetPassword.scss";
import logo from "../../assets/img/logos/readySkill-light.png";

function ResetPasswordSentOTP() {

  const navigate = useNavigate();
  const toast = useToastDispatch();
  
  const { register, formState: { errors }, handleSubmit } = useForm({ mode: 'onChange'});

  const [errorMsg, setErrorMsg] = React.useState('');
  const [ipError, setIpError] = React.useState(false)
  const [ipAddress, setIpAddress] = useState("");

  const isMounted = useIsMounted();

  const sentOtp = (data) => {
    let params = {
      userEmail: data.userEmail,
      ipAddress: ipAddress
    }//added ip address
    
    resetPasswordSentOtp(params)
      .then(res => {
        if (res.data.isSuccess) {
          if(isMounted()){
            toast({ type: "success", text: res.data.message })
            navigate("/portal/resetPasswordOTP", {state: { data: res.data }})
          
          }
        } else {
         if(isMounted()){
          toast({ type: "error", text: res.data.message })
         }
        }
      })
      .catch(err => {
        console.log(err.response)
        if(isMounted()){
          if (!err.response.data.isSuccess && err.response.data.message === "IP Restricted") {
            setIpError(true);
            
          } else if (err.response.status === 400 && !err.response.data.isSuccess) {
            setErrorMsg(err.response.data.message)
            
          }
        }

      })
  }

  const getIp = () => {
    getIpAddress().
      then((response) => {
        return response.json();
      })
      .then((obj) => {
        if(isMounted()){
          setIpAddress(obj.ip)
        }

      })
  }

  useEffect(() => {
    getIp();
  }, [])

  return (
    <div className="reset-pass-container">
      <IpRestrictModal ipError={ipError} setIpError={setIpError} />
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
          <form className="loginForm" onSubmit={handleSubmit(sentOtp)}>
            <div className="form-group">
              <input
                type="email"
                className="form-control mb-1"
                id="email"
                placeholder="Enter email"
                {...register("userEmail", { required: true })}
              />
              {
                errors.userEmail ? <span className="error-msg">Email required</span>
                  : errorMsg ? <span className="error-msg">{errorMsg}</span> : ''
              }
            </div>
            <div className="reset-buttons mb-4">
              <button type="button" onClick={() => navigate("/portal/login")}
                className="btn btn-block cancel-btn">Cancel
              </button>
              <button type="submit" className="btn btn-default submit-button">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordSentOTP;
