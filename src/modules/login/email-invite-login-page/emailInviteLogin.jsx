import React, { useEffect, useState } from 'react';

import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';

import { UserAuthState } from "../../../context/user/userContext";

import { useToastDispatch } from '../../../context/toast/toastContext';

// import { verifyInvitedUser, getIpAddress } from '../../../services/apiServices';

import { verifyInvitedUser, getIpAddress } from '../../../services/userManagementServices';

import IpRestrictModal from "../../../sharedComponents/ipRestrict/ipRestrict";
import { useIsMounted } from '../../../utils/useIsMounted';
import './emailInvite.scss';

function EmailInviteLogin() {

    const userState = UserAuthState();
    
    const toast = useToastDispatch();

    const navigate = useNavigate();
    const location = useLocation();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({ mode: 'onChange'});

    const params = new URLSearchParams(location.search);

    const inviteEmail = params.get("UserEmail");
    const inviteCode = params.get("InviteCode");

    const [inviteCodeDisabled, setInviteCodeDisabled] = useState(false);
    const [ipError, setIpError] = React.useState(false)
    const [ipAddress, setIpAddress] = useState("");
    const isMounted = useIsMounted();


    useEffect(() => {
        if (userState.isLoggedIn) {
            navigate("/portal/dashboard");
        } else {
            if (inviteEmail && inviteCode) {
                
               if(isMounted()){
                setValue("email", inviteEmail)
                setValue("inviteCode", inviteCode)
               }

                getIpAddress()
                .then((response) => {
                    return response.json();
                })
                .then((obj) => {
                    verifyUserSubmit({ email: inviteEmail, inviteCode: inviteCode,  ipAddress: obj.ip })
                })
                
               
            } else if (inviteCode) {
                
                if(isMounted()){
                    setValue("email", "")
                    setValue("inviteCode", inviteCode);
                    setInviteCodeDisabled(true);
                }
            }

        }
        getIp();
    }, []);

    const verifyUserSubmit = (data) => {

        let params = {
            userEmail: [data.email],
            inviteCode: data.inviteCode,
            ipAddress: ipAddress
        }
        
        verifyInvitedUser(params)
            .then(res => {
                if (res.data.isSuccess === true) {
                    setTimeout(() => {
                        toast({ type: "success", text: res.data.message })
                        navigate("/portal/invite_signup",
                            {state: { emailWithCode: true, invitedEmail: data.email, inviteCode: data.inviteCode }
                        })
                        
                    }, 1000)

                } else {

                    
                    if (res.data.message === "IP Restricted") {
                        if(isMounted()){
                            setIpError(true);
                        }
                    } else {
                        toast({ type: "error", text: res.data.message })
                    }
                }
            })
            .catch(err => {
                
                toast({ type: "error", text: err.response.data })
                console.log(err.response)
            })
    }

    const getIp = () => {
        getIpAddress()
        .then((response) => {
            return response.json();
        })
        .then((obj) => {
            if(isMounted()){
                setIpAddress(obj.ip)
            }

        })
    }
    return (
        <div className="email-invite-container">
            <IpRestrictModal ipError={ipError} setIpError={setIpError} />
            <div className="container-fluid p-0">
                <div className="wrap-login">
                    <div className="login-title inviteEmail-bg">
                        <span className="login-form-title ">Sign-Up Using an Invite Code</span>
                    </div>
                </div>
            </div>
            <div className="emailInvite-container mt-5">
                <p className="text-center signup-text">To sign up for the ReadySkill partner portal you must have an invite
                    code from your organization administrator. If you do not have an
                    invite code or your code has expired, please contact your
                    organization administrator to get a new code.
                </p>
                <p className="text-center signup-text">This page will lock out your IP address after too many
                    failed attempts.
                </p>
                <form className="login-form " onSubmit={handleSubmit(verifyUserSubmit)}>
                    <div className="wrap-input mb-1 mt-5" data-validate="">
                        <input className="input-items mb-2" type="text" name="email" placeholder="Email"
                            {...register("email", { required: true })} />
                        {errors.email ? <span className="error-msg"> Email required </span> : ''}
                        <span className="symbol-input100">
                            <span className="lnr lnr-envelope"></span>
                        </span>
                    </div>
                    <div className="wrap-input mb-1 mt-3" data-validate="">
                        <input disabled={inviteCodeDisabled ? true : false}
                            className={` ${inviteCodeDisabled ? 'disabled-input' : ''} input-items mb-2`} type="text" name="text" placeholder="Invite Code"
                            {...register("inviteCode", { required: true })} />
                        {errors.inviteCode ? <span className="error-msg"> Please enter invite code</span> : ''}

                    </div>
                    <div className="container-form-btn pt-2 pb-5">
                        <button type="submit" className="Invite-email-btn mt-4">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EmailInviteLogin
