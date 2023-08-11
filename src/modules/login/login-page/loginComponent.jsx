import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import { useLocation } from 'react-router-dom';

import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

//context
import { UserAuthDispatch } from '../../../context/user/userContext';
import { useToastDispatch } from '../../../context/toast/toastContext';
import { useIsMounted } from '../../../utils/useIsMounted';
import { useSignalRDispatch } from "../../../context/signalR/signalR";


//services
// import { login, setToken, getIpAddress, external_login, google_api, linkedIn_api } from '../../../services/apiServices';

import { setToken } from '../../../services/apiServices';

import { login, external_login, google_api, linkedIn_api, microsoft_api, getIpAddress, external_register } from '../../../services/userManagementServices';

import { AppConfig } from '../../../services/config';
import IpRestrictModal from "../../../sharedComponents/ipRestrict/ipRestrict";

import './login.scss';
import linkedin from "../../../assets/img/linkedin.png";

import microsoftIcon from "../../../assets/img/microsoftIcon.png"

import logo from "../../../assets/img/logos/readySkill-light.png";
import OrgLogo from "../../../assets/img/logos/org-logo.png";
import { APIconst } from '../../../utils/contants';

function LoginComponent() {

    const googleIcon = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png';

    //context
    const userDispatch = UserAuthDispatch();
    const toast = useToastDispatch();

    const signalR = useSignalRDispatch()

    const navigate = useNavigate();
    const location = useLocation();
    const { register, formState: { errors }, handleSubmit, watch } = useForm({ mode: 'onChange' });

    const [ipError, setIpError] = React.useState(false)

    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);

    const [userEmail, setUserEmail] = useState(null);
    const [userPassword, setUserPassword] = useState(null);
    const [ipAddress, setIpAddress] = useState("");
    const [loginError, setLoginError] = useState("");
    const [countryCode, setCountryCode] = useState("");
    const isMounted = useIsMounted();

    const watchEmail = watch("email");
    if (!watchEmail && emailError) {
        setEmailError(null);
    }
    if (emailError && watchEmail !== userEmail) {
        setEmailError(null)
    }

    const watchPassword = watch("password");
    if (!watchPassword && passwordError) {
        setPasswordError(null);
    }
    if (passwordError && watchPassword !== userPassword) {
        setPasswordError(null)
    }

    const [passwordShown, setPasswordShown] = React.useState(false);
    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    };

    const getIp = () => {
        getIpAddress()
            .then((response) => {
                return response.json();
            })
            .then((obj) => {
                localStorage.setItem("ipAddress", obj.ip);
                setIpAddress(obj.ip);
                setCountryCode(obj.country_code);

            })
    }
    const loginSubmit = (data) => {
        setUserEmail(data.email);
        setUserPassword(data.password);
        setEmailError(null);
        setPasswordError(null)
        data.ipAddress = ipAddress; //Passing ip address to the backend
        data.countryCode = countryCode;
        login(data)
            .then(res => {
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
                        userLogo: res.data.logoImageUrl ? res.data.logoImageUrl : "",
                        userRolesIds: res.data.userRolesIds ? res.data.userRolesIds : []
                    }

                    // setTimeout(() => {

                    if (isMounted()) {
                        userDispatch({ type: "LOGIN", payload: user });
                        localStorage.setItem("user", JSON.stringify(user));
                        localStorage.removeItem("inviteCodeRegisterOrgId");
                        localStorage.removeItem("externalLoginType");
                        setToken(res.data.token, res.data.id); //Will change it
                        signalR.startHubConnectionHandler(res.data.id);
                        navigate("/portal/dashboard");
                    }
                    // }, 500);



                } else {
                    // setTimeout(() => {

                    if (res.data.errorName && res.data.errorName === "IP Restriction Error") {
                        if (isMounted()) {
                            setIpError(true)
                        }
                    } else {
                        if (isMounted()) {
                            setLoginError(res.data.message);
                        }
                    }
                    // }, 500);
                }
            })
            .catch(err => {
                console.log(err);
                setTimeout(() => {

                }, 500);
            })


    }

    useEffect(() => {
        const source = axios.CancelToken.source();

        let mounted = true;
        if (mounted) {
            getIp();
        }

        return () => {
            mounted = false;
            source.cancel();
        };
    }, []);

    const handleExternalLoginClick = (type) => {
        // console.log(type)
        localStorage.setItem("externalLoginType", type);
        // window.location.href = `${AppConfig.baseUrl}${APIconst.IDENTITY}/externalauthentication/${type}/Portal`;
        window.location.href = `${AppConfig.externalIdentityUrl}/externalauthentication/${type}/Portal`;

    }


    useEffect(() => {

        let mounted = true;
        const source = axios.CancelToken.source();

        const external_login_type = localStorage.getItem("externalLoginType");
        const params = new URLSearchParams(location.search);
        console.log(params.get("access_token"));
        console.log(params.get("email"));
        if (mounted && external_login_type === "Google") {
            google_etxernal_login();
        }

        if (mounted && external_login_type === "LinkedIn") {
            linkedIn_external_login();
        }

        if (mounted && external_login_type === "Microsoft") {
            microsoft_external_login();
        }

        return () => {
            mounted = false;
            source.cancel();
        };

    }, []);

    const google_etxernal_login = () => {

        const params = new URLSearchParams(location.search);

        const token = params.get("access_token");
        const email = params.get("email");


        if (token && email) {



            google_api(token)
                .then((response) => {
                    return response.json();

                })
                .then((provider_data) => {

                    if (provider_data.error) {

                        console.log(provider_data.error);
                        // toast({type:"error", text : "Something went wrong. Please try agian !"})
                    } else {

                        const data = {}
                        data.providerName = 'Google';
                        data.providerKey = provider_data.sub;
                        data.email = provider_data.email;
                        data.platformType = 'Portal';
                        data.externalAuthProvider = 'Google';
                        data.externalAuthToken = token;

                        externalLoginSubmit(data, provider_data);
                    }
                })
                .catch(err => {
                    console.log(err.error);

                })
        }
    }

    const linkedIn_external_login = () => {

        const params = new URLSearchParams(location.search);

        const token = params.get("access_token");
        const email = params.get("email");

        if (token && email) {


            linkedIn_api(token)
                .then((provider_data) => {

                    if (provider_data.error) {

                        console.log(provider_data.error)
                        // toast({type:"error", text : "Something went wrong. Please try agian !"})

                    } else {

                        const data = {}
                        data.providerName = 'LinkedIn';
                        data.providerKey = provider_data.data.id;
                        data.email = email;
                        data.platformType = 'Portal';
                        data.externalAuthProvider = 'LinkedIn'
                        data.externalAuthToken = token

                        externalLoginSubmit(data, provider_data);
                    }
                })
                .catch(err => {
                    console.log(err.error);
                    toast({ type: "error", text: "Something went wrong. Please try agian !" })

                })
        }

    }

    const microsoft_external_login = () => {

        const params = new URLSearchParams(location.search);

        const token = params.get("access_token");
        const email = params.get("email");

        // console.log(token);
        // console.log(email);

        if (token && email) {

            microsoft_api(token, email)
                .then((response) => {
                    return response.json();
                })
                .then((provider_data) => {

                    if (provider_data.error) {

                        console.log(provider_data.error);
                        // toast({type:"error", text : "Something went wrong. Please try agian !"})
                    } else {

                        const data = {}
                        data.providerName = 'Microsoft';
                        data.providerKey = provider_data.id;
                        data.email = provider_data.mail;
                        data.platformType = 'Portal';
                        data.externalAuthProvider = 'Microsoft';
                        data.externalAuthToken = token;

                        externalLoginSubmit(data, provider_data);
                    }
                })
                .catch(err => {
                    console.log(err.response)
                })
        }


    }

    const externalLoginSubmit = (data, provider_data) => {
        // console.log(data, provider_data)
        external_login(data)
            .then(res => {
                // login
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
                        userLogo: res.data.logoImageUrl ? res.data.logoImageUrl : "",
                        UserRolesIds: res.data.UserRolesIds ? res.data.UserRolesIds : []

                    }

                    setTimeout(() => {

                        if (isMounted()) {
                            userDispatch({ type: "LOGIN", payload: user });
                            localStorage.setItem("user", JSON.stringify(user));
                            localStorage.removeItem("externalLoginType");
                            localStorage.removeItem("inviteCodeRegisterOrgId")
                            setToken(res.data.token, res.data.id); //Will change it
                            signalR.startHubConnectionHandler(res.data.id);
                            navigate("/portal/dashboard");
                            toast({ type: "success", text: "Login successful" })
                        }
                    }, 500);

                    // suspended case
                } else if (!res.data.isSuccess && (
                    res.data.errorName === "SuspenedOrDeleted"
                    || res.data.errorName === "DomainError"
                    || res.data.errorName === "AuthorizationMethodError")) {

                    if (isMounted()) {
                        toast({ type: "error", text: res.data.message })
                    }
                    return;

                    // register
                } else {

                    setTimeout(() => {

                        const external_login_type = localStorage.getItem("externalLoginType");

                        const provide_obj = {};
                        provide_obj.externalAuthProvider = data.externalAuthProvider;
                        provide_obj.externalAuthToken = data.externalAuthToken;

                        if (external_login_type === "LinkedIn") {

                            provide_obj.email = data.email;
                            provide_obj.firstName = provider_data.data.localizedFirstName;
                            provide_obj.lastName = provider_data.data.localizedLastName;
                            provide_obj.sub = provider_data.data.id;
                            provide_obj.name = provider_data.data.localizedFirstName + '' + provider_data.data.localizedLastName;

                        } else if (external_login_type === "Google") {

                            provide_obj.email = provider_data.email;
                            provide_obj.firstName = provider_data.given_name;
                            provide_obj.lastName = provider_data.family_name;
                            provide_obj.sub = provider_data.sub;
                            provide_obj.name = provider_data.name;

                        } else if (external_login_type === "Microsoft") {

                            provide_obj.email = provider_data.mail;
                            provide_obj.firstName = provider_data.givenName ? provider_data.givenName : provider_data.displayName;
                            provide_obj.lastName = provider_data.surname ? provider_data.surname : '';
                            provide_obj.sub = provider_data.id;
                            provide_obj.name = provider_data.displayName;
                        }

                        // console.log(provide_obj)

                        if (isMounted()) {

                            const inviteCodeOrgId = localStorage.getItem("inviteCodeRegisterOrgId");

                            if (inviteCodeOrgId) {

                                // console.log(provide_obj);

                                const obj = {};
                                obj.providerName = external_login_type;
                                obj.providerKey = provide_obj.sub;
                                obj.email = provide_obj.email
                                obj.firstName = provide_obj.firstName
                                obj.lastName = provide_obj.lastName
                                obj.platformType = 'Portal'
                                obj.organizationId = inviteCodeOrgId;

                                // console.log(obj);

                                external_register(obj)
                                    .then(res => {
                                        if (res.data.isSuccess) {

                                            const data = {};
                                            data.providerName = external_login_type;
                                            data.providerKey = provide_obj.sub;
                                            data.email = provide_obj.email;
                                            data.platformType = 'Portal';
                                            data.externalAuthProvider = provide_obj.externalAuthProvider;
                                            data.externalAuthToken = provide_obj.externalAuthToken;
                                            external_login(data)
                                                .then(res => {
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
                                                            userLogo: res.data.logoImageUrl ? res.data.logoImageUrl : "",
                                                            UserRolesIds: res.data.UserRolesIds ? res.data.UserRolesIds : []
                                                        }

                                                        // setTimeout(() => {

                                                        if (isMounted()) {
                                                            toast({ type: "success", text: "Login successful" })
                                                            userDispatch({ type: "LOGIN", payload: user });
                                                            localStorage.setItem("user", JSON.stringify(user));
                                                            localStorage.removeItem("externalLoginType");
                                                            localStorage.removeItem("inviteCodeRegisterOrgId")
                                                            setToken(res.data.token, res.data.id); //Will change it
                                                            navigate("/portal/dashboard");
                                                        }
                                                        // }, 500);
                                                    } else {
                                                        toast({ type: "error", text: res.data.message })
                                                    }
                                                })
                                                .catch(err => {
                                                    console.log(err);
                                                })
                                        } else {
                                            toast({ type: "error", text: res.data.message })
                                        }
                                    })
                                    .catch(err => {
                                        console.log(err.response)
                                    })

                            } else {

                                toast({ type: "success", text: "Please enter the organization invite code" });

                                navigate("/portal/invite_code",
                                    {
                                        state: {
                                            external_login: true,
                                            external_login_type: external_login_type,
                                            user_data: res.data,
                                            provider_data: provide_obj
                                        }
                                    }
                                );
                            }

                        }

                    }, 500);
                }
            })
            .catch(err => {
                console.log(err.response);

            })
    }

    return (
        <div className="loginMain-container">

            <IpRestrictModal ipError={ipError} setIpError={setIpError} />

            <div className="container-fluid gradient">
                <div className="row readySkill-logo">
                    <img src={logo} alt="logo" />
                </div>
            </div>

            <div className="container-fluid formBG">
                <div className="readySkill-logo text-center mb-4">
                    <img src={OrgLogo} alt="logo" className='org-logo' />
                </div>

                <form className="loginForm" onSubmit={handleSubmit(loginSubmit)}>

                    <div className="form-group mb-3">
                        <input type="email" className="form-control mb-1" id="email" placeholder="Enter email"
                            {...register("email", { required: true })} />
                        {errors.email ? <span className="error-msg"> Email required </span>
                            : emailError ? <span className="error-msg">{emailError}</span> : ''}
                    </div>

                    <div className="form-group login-pass mb-0 position-relative">
                        <input type={passwordShown ? "text" : "password"} className="form-control custom-form mb-1" id="pwd" placeholder="Enter password"
                            {...register("password", { required: true, onChange: () => setLoginError("") })} />
                        <span className="material-icons eye-icon mr-0" onClick={togglePasswordVisiblity}>
                            {passwordShown ? 'visibility_off' : 'visibility'}
                        </span>
                    </div>
                    <div className="mb-1">
                            {!errors.password && loginError ? <span className="error-msg">{loginError}</span> : ''}
                            {errors.password ? <span className="error-msg"> Password required </span>
                            : passwordError ? <span className="error-msg">{passwordError}</span> : ''}
                        </div>
                   


                    <div className="login">
                        <button type="submit" className="btn btn-default loginButton">LOGIN</button>
                    </div>
                    <div className="text-center w-100 mt-4 other-login-text">
                        <span className="text-white">
                            Or Continue With :
                        </span>
                    </div>
                    <div className="other-logins mt-3">
                        <button type="button" onClick={() => handleExternalLoginClick('LinkedIn')} className="btn-face other-login-btn">
                            <img width="80px" className="mb-1 linkedin-icon" alt="linkedin" src={linkedin} />
                        </button>

                        <button type="button" onClick={() => handleExternalLoginClick('Google')} className="btn-google other-login-btn" >
                            <img width="23px" className="mb-1" alt="Google sign-in" src={googleIcon} />
                        </button>
                        <button type="button" onClick={() => handleExternalLoginClick('Microsoft')} className="btn-google other-login-btn" >
                            <img width="23px" className="mb-1" alt="Microsoft sign-in" src={microsoftIcon} />
                        </button>
                    </div>
                    <div className="text-center w-100 extra-links text-nowrap">
                        <span className="txt1">
                            Forgot your username or password?
                        </span>

                        <Link className="txt2 login-links" to="/portal/resetPassword"> Reset it here</Link>
                    </div>
                    <div className="text-center w-100 mt-2 text-nowrap">
                        <span className="txt1">
                            No account yet? Sign-up with an
                        </span>

                        <Link className="txt2 login-links" to="/portal/invite_code"> Invite code here</Link>

                    </div>
                </form>

            </div>
        </div>
    )
}

export default LoginComponent
