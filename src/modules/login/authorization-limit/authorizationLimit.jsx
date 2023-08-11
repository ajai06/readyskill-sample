import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { AppConfig } from '../../../services/config';

import linkedinIcon from "../../../assets/img/linkedin-icon.png";
import googleIcon from "../../../assets/img/google-icon.svg";
import microsoftIcon from "../../../assets/img/microsoftIcon.png"
import readySkillIcon from "../../../assets/img/readySkill-dark.png"

import "./authorization.scss";
import { getExternalLoginTypesPortalSecurity } from '../../../services/adminServices';
import { APIconst } from '../../../utils/contants';

function AuthorizationLimit() {

  const navigate = useNavigate();
  const location = useLocation();

  const [googleLogin, setGoogleLogin] = useState();
  const [microsoftLogin, setMicrosoftLogin] = useState();
  const [linkedInLogin, setLinkedInLogin] = useState();
  const [readySkillLogin, setReadySkillLogin] = useState();

  useEffect(() => {

    if (location.state) {
      externalAuthenticationDetails();
    } else {
      navigate("/portal/invite_code")
    }

  }, [])



  const externalAuthenticationDetails = () => {
    getExternalLoginTypesPortalSecurity()
      .then(res => {
        if (res.data) {
          const type_google = res.data.find(item => item.typeName === "Google");
          setGoogleLogin(type_google);

          const type_linkedIn = res.data.find(item => item.typeName === "LinkedIn");
          setLinkedInLogin(type_linkedIn);

          const type_microsoft = res.data.find(item => item.typeName === "Microsoft");
          setMicrosoftLogin(type_microsoft);

          const type_readySkill = res.data.find(item => item.typeName === "Local");
          setReadySkillLogin(type_readySkill);
          console.log(res.data);
        }
      })
  }
  const readySkillRegister = () => {

    navigate("/portal/invite_signup", { state: location.state });

  }

  const handleExternalLoginClick = (type) => {
    localStorage.setItem("externalLoginType", type);
    // window.location.href = `${AppConfig.baseUrl}${APIconst.IDENTITY}/externalauthentication/${type}/Portal`;
    window.location.href = `${AppConfig.externalIdentityUrl}/externalauthentication/${type}/Portal`;

  }


  return (
    <div className="authorization-container">
      <div className="main-bg">

        <div className="container-fluid p-0">
          <div className="wrap-login">
            <div className="login-title login-bg">
              <span className="login-form-title ">
                Sign-Up Using an Invite Code
              </span>
            </div>
          </div>
        </div>

        <div className="inviteCode-container">

          <p className="text-center signup-text">
            Your organization allows you to sign-up using the following methods
          </p>

          <div className="container-form-btn pt-2 mb-4">

            {
              readySkillLogin?
                <div>
                  <button type="button" className="btn-face google-signup" onClick={readySkillRegister}>
                    <img className="mb-1 mt-1 mr-2 readySkill-icon" alt="icon" src={readySkillIcon} />
                    <span className="google-text">Sign up with ReadySkill</span>
                  </button>
                </div> : ''
            }

            {
              googleLogin?
                <div>
                  <button type="button" className="btn-face google-signup mt-3" onClick={() => handleExternalLoginClick('Google')}>
                    <img className="mb-1 mr-2 google-icon" alt="google" src={googleIcon} />
                    <span className="google-text">Sign up with Google</span>
                  </button>
                </div> : ''
            }

            {
              linkedInLogin?
                <div>
                  <button type="button" className="btn-face linkedin-signup mt-3" onClick={() => handleExternalLoginClick('LinkedIn')}>
                    <img className="mb-1 mr-2 linkedin-icon" alt="linkedin" src={linkedinIcon} />
                    <span className="linkedin-text">Sign up with LinkedIn</span>
                  </button>
                </div> : ''
            }

            {
              microsoftLogin?
                <div>
                  <button type="button" className="btn-face google-signup mt-3" onClick={() => handleExternalLoginClick('Microsoft')}>
                    <img className="mb-1 mr-2 linkedin-icon" alt="linkedin" src={microsoftIcon} />
                    <span className="google-text">Sign up with Microsoft</span>
                  </button>
                </div> : ''
            }


          <button type="button" onClick={() => navigate("/portal/invite_code")}
            className="btn btn-block cancel-btn">
            Cancel
          </button>
          </div>

          

        </div>

      </div>
    </div>
  );
}

export default AuthorizationLimit;
