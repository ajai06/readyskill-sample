import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";

import { Link } from 'react-router-dom';

// import { confirmEmail } from "../../../services/apiServices";
import { useIsMounted } from '../../../utils/useIsMounted';
import { confirmEmail, confirmNewEmail } from "../../../services/userManagementServices";
import "./emailVerified.scss";
import logo from "../../../assets/img/readySkill-dark.png"
function EmailVerificationResponse() {

  const location = useLocation();

  const params = new URLSearchParams(location.search);
  
  const userId = params.get("userid");
  const token = params.get("token");
  const emailDateTime = params.get("EmailDateTime");
  const newEmail = params.get("EmailId")

  const [responseMessage, setResponseMessage] = useState('')
  const isMounted = useIsMounted();

  useEffect(() => {
    if(newEmail) {
      let data = {
        userId,
        token: token,
        emailDateTime: emailDateTime,
        newEmail
      }
      setTimeout(() => {
        confirmNewEmail(data)
          .then(res => {
            
            if(isMounted()){
              setResponseMessage(res.data)
            }
  
          })
          .catch(err => {
            
            console.log(err.response)
            if(isMounted()){
              setResponseMessage(err.response.data)
            }
          })
      }, 500);
    }
    else {
      let params = {
        userid: userId,
        token: token,
        emailDateTime: emailDateTime
      }
      setTimeout(() => {
        confirmEmail(params)
          .then(res => {
            
            if(isMounted()){
              setResponseMessage(res.data)
            }
  
          })
          .catch(err => {
            
            console.log(err.response)
            if(isMounted()){
              setResponseMessage(err.response.data)
            }
          })
      }, 500);
    }
  

  }, [])

  return (
    <div>
      <div className="head email-verification">
        <div className="main-body">
          <div className="logo dis-flex">
            <img src={logo} alt="logo" className="mt-1 verification-logo" />
          </div>
          <div className="px-25 pt-40">
            <div className="bg-white">
              <span className="material-icons mail-icon">
                mark_email_read
              </span>
              <p className="text-center mt-4 bold-txt color-1">
                Dear {responseMessage.firstName} {responseMessage.lastName}
              </p>
              <p className="mt-4 color-1">
                {responseMessage.message}
              </p>
              <Link className="login-link mb-4" to="/portal/login">
                Click here to login
              </Link>
            </div>
            <p className="text-justify footer-txt">
              This one-time message was sent to {responseMessage.userEmail} from an unmonitored
              account by the ReadySkill platform in response to an invitation
              request by your organization admin. If you are not the intended
              recipient, please disregard this message.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailVerificationResponse;
