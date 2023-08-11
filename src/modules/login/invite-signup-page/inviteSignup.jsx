import React, { useEffect, useState, useRef } from 'react';

import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from "react-router-dom";

// import { invitedUserRegister } from '../../../services/apiServices';

import { invitedUserRegister } from '../../../services/userManagementServices';


import { useToastDispatch } from '../../../context/toast/toastContext';
import { useIsMounted } from '../../../utils/useIsMounted';
import './inviteSignup.scss';

function InviteSignupContainer() {

    const { register, handleSubmit, formState: { errors }, setValue } = useForm({ mode: 'onChange'});
    const navigate = useNavigate();
    const location = useLocation();
    
    const toast = useToastDispatch();

    const [emailDisabled, setEmailDisabled] = useState(false);
    const [inviteCode, setInviteCode] = useState('');
    const [orgId, setOrgId] = useState('');
    const isMounted = useIsMounted();


    useEffect(() => {
        if (location.state) {
            if (location.state.emailWithCode) {
                if(isMounted()){
                    setValue("registerEmail", location.state.invitedEmail);
                    setInviteCode(location.state.inviteCode);
                    setEmailDisabled(true)
                }
            } else {
                if(isMounted()){
                    setEmailDisabled(false);
                    setOrgId(location.state.orgId)
                }
            }
        } else {
            navigate("/portal/login")
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

    const inviteSignUpSubmit = (data) => {

        data.platformType = "Portal";
        data.confirmPassword = null;

        if (emailDisabled) {
            data.inviteCode = inviteCode
        } else {
            data.organizationId = orgId
        }

        
        invitedUserRegister(data)
        .then(res => {
            if (res.data.isSuccess) {
                setTimeout(() => {
                    if(isMounted()){
                        navigate("/portal/login");
                    
                        toast({ type: "success", text: res.data.message, timeout: 7000 })
                    }
                }, 500)
            }else{
                
                if(isMounted()){
                    toast({ type: "error", text: res.data.message });
                }
            }
        })
        .catch(err => {
            console.log(err.response)
            
            if(isMounted()){
                if (err.response.data) {
                    toast({ type: "error", text: err.response.data.message });
                } else {
                    toast({ type: "error", text: err.response.statusText });
                }
            }
        })
    }

    const routing = () => {
        if (!location.state.emailWithCode) {
            navigate(-1);
        } else {
            navigate("/portal/invitation")
        }
    }

    return (
        <div className="invite-signup-container">
            <div className="container-fluid gradient">
                <div className="row form-head">
                    <h4 className="head">User Registration</h4>
                </div>
            </div>

            <div className=" main-bg col-xl-12 col-lg-12 col-md-12 p-0">
                <div className="pt-5 user-reg-card">

                    <form onSubmit={handleSubmit(inviteSignUpSubmit)}>

                        <div className="row mb-3">
                            <div className="col">
                                <div className="form-outline form-relative">
                                    <label className="form-label inner-sub" htmlFor="first_name">First Name</label>
                                    <input type="text" id="first_name" className="form-control mb-2" placeholder="First Name"
                                        {...register("firstName", { required: true })} />

                                </div>
                                {errors.firstName ? <span className="error-msg">First name required</span> : ''}
                            </div>
                            <div className="col">
                                <div className="form-outline">
                                    <label className="form-label inner-sub" htmlFor="last_name">Last Name</label>
                                    <input type="text" id="last_name" className="form-control mb-2" placeholder="Last Name"
                                        {...register("lastName", { required: true })} />

                                </div>
                                {errors.lastName ? <span className="error-msg">Last name required</span> : ''}
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col">
                                <div className="form-outline">
                                    <label className="form-label inner-sub" htmlFor="register_email">Register Email</label>
                                    <input type="email" id="register_email" disabled={emailDisabled}
                                        className={` ${emailDisabled ? 'disabled-input' : ''} form-control mb-2`} placeholder="Register Email"
                                        {...register("registerEmail", { required: true, pattern: /^(([^<>()[\]\\.,;:+\s@"]+(\.[^<>()[\]\\.,;:+\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ })} />

                                </div>
                                {/* { errors.registerEmail ? <span className="error-msg">Email required</span>  */}
                                {/* : emailError ? <span className="error-msg">{emailError}</span> : '' } */}
                                {errors.registerEmail?.type === "required"
                                    ? <span className="error-msg">Email required</span>
                                    : errors.registerEmail?.type === "pattern"
                                        ? <span className="error-msg">Enter valid email</span>
                                        : ''
                                }
                            </div>
                            <div className="col">
                                <div className="form-outline position-relative">
                                    <label className="form-label inner-sub" htmlFor="register_password">Register Password</label>
                                    <input type={passwordShown ? "text" : "password"} id="register_password"
                                        className="form-control mb-2" placeholder="Register Password"
                                        {...register("registerPassword", {
                                            required: true, minLength: 8,
                                            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,50}$/
                                        })
                                        }
                                    />
                                    <span className="material-icons eye-icon" onClick={togglePasswordVisiblity}>
                                        {passwordShown ? 'visibility_off' : 'visibility'}
                                    </span>

                                </div>
                                {
                                    errors.registerPassword?.type === "required" ?
                                        <span className="error-msg">Password required</span>
                                        : errors.registerPassword?.type === "minLength"
                                            ? <span className="error-msg">Minimum 8 characters required</span>
                                            : errors.registerPassword?.type === "pattern"
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

                        </div>
                        {/* <div className="row mb-3">
                            <div className="col">
                                        <div className="form-outline">
                                            <label className="form-label subText" htmlFor="confirm_password">Confirm Password</label>
                                            <input type={confirmPasswordShown ? "text" : "password"} id="confirm_password"
                                                   className="form-control mb-2" placeholder="Confirm Password"
                                                   {...register("confirmPassword",
                                                      { required: true, validate: value => value === watch("registerPassword") })
                                                   }
                                            />
                                            <span className="material-icons eye-icon" onClick={toggleConfirmPasswordVisiblity}>
                                                {confirmPasswordShown ? 'visibility' : 'visibility_off'}
                                            </span>
                                          
                                        </div>
                                        {
                                                errors.confirmPassword?.type === "required" ?
                                                    <span className="error-msg">Confirm password required</span>
                                                    : errors.confirmPassword?.type === "validate" ?
                                                        <span className="error-msg">Password not matching</span> : ''
                                            }
                                    </div>
                        </div> */}

                        <div className="row mb-3">
                            <div className="col org-buttons">
                                <button type="button" onClick={() => routing()} className="btn btn-block cancel-btn mb-2 mt-4">Cancel</button>
                                <button type="submit" className="btn btn-block create-btn mb-2 mt-4">REGISTER</button>
                            </div>
                        </div>

                    </form>


                </div>
            </div>
        </div>
    )
}

export default InviteSignupContainer
