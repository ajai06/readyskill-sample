import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
// import { getAllRoles } from "../../../../services/apiServices";
// import { ReactMultiEmail, isEmail } from 'react-multi-email';
import 'react-multi-email/style.css';

import { UserAuthState } from '../../../../context/user/userContext';

import { useToastDispatch } from '../../../../context/toast/toastContext';

// import { inviteUser } from '../../../../services/apiServices';

import { inviteUser, getAllRoles } from '../../../../services/organizationServices';

import { Roles } from '../../../../utils/contants';

import './invitation.scss';

const InvitationContainer = () => {

    const userState = UserAuthState();
    
    const toast = useToastDispatch();

    const { register, formState: { errors }, handleSubmit, setValue } = useForm();
    const { id } = useParams();


    const [emails, setEmails] = useState([]);
    const [emailError, setEmailError] = useState(null);
    const [emailExistsMsg, setEmailExistsMsg] = useState('');
    const [existingEmails, setExistingEmails] = useState([])
    const [allRoles, setAllRoles] = useState([]);
    const [organizationId, setOrganizationId] = useState('');

    const mountedRef = useRef(false);

    useEffect(() => {
        mountedRef.current = true
        return () => {
            mountedRef.current = false
        }
    }, []);

    useEffect(() => {

        if(mountedRef){
            setOrganizationId(id)

            getAllRoles()
                .then(res => {
                    setAllRoles(res.data);
                    if(userState.role_GlobalAdmin) {
                        let role = res.data.find(item => item.name === Roles.ORGANISATIONADMIN)
                        setValue("roleId", role.id);
                    }
                    if(userState.role_OrganizationAdmin) {
                        let role = res.data.find(item => item.name === Roles.USER)
                        setValue("roleId", role.id);
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, []);

    useEffect(() => {
        if(emails.length > 0 ){
            setEmailError(null)
        }
    }, [emails])

    
    const [items, setItems ] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState(null);

    // handling keypress like enter tab ,
    const handleKeyDown = evt => {

        if (["Enter", "Tab", ","].includes(evt.key)) {

            evt.preventDefault();
            var value = inputValue.trim();

            if (value && isValid(value)) {
                if(mountedRef){
                    setItems([...items, inputValue])
                    setInputValue("");
                }
            }
        }
    };

    // input change
    const handleChange = evt => {
        if(mountedRef){
            setInputValue(evt.target.value);
            setError(null);
            setEmailError(null);
        }
    };

   // handle paste value from clipboard
    const handlePaste = evt => {

        evt.preventDefault();
        setEmailError(null)

        var paste = evt.clipboardData.getData("text");
        var splitted_emails =  paste.split(/[ ,]+/);

        //removing white space
        const emails = splitted_emails.map(email => email.trim());

        if (emails && mountedRef) {
            var toBeAdded = Array.from(new Set(emails.filter(email => !isInList(email))));
            setItems([...items, ...toBeAdded]);
        }
    };

    // check email validation
    const isValid = (email) => {

        let error = null;

        if (isInList(email)) {
            error = `${email} has already been added.`;
        }

        if (!emailValidation(email)) {
            error = `${email} is not a valid email address.`;
        }

        if (error) {
            setError( error);
            return false;
        }

        return true;
    }

    // check email already exists in list
    const isInList = (email) => {
        return items.includes(email);
    }

    // email regex validation
    const emailValidation = (email) => {

        const re = /^(([^<>()[\]\\.,;:+\s@"]+(\.[^<>()[\]\\.,;:+\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const pattern = /^[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

        return re.test(String(email).toLowerCase()) && pattern.test(email);

    }

    // double click to edit email
    const handleDbClick = (email, index) => {

        if(mountedRef){
            if(inputValue) {
                setItems([...items.filter((item, i) => { 
                    return  item !== email
                }), inputValue]);
                setInputValue(email)
            } else {
                setItems(items.filter((item, i) => { 
                    return  item !== email
                }));
                setInputValue(email);
            }
        }

    }

    // removing email from the list
    const handleDelete = (email, index) => {

        if(mountedRef){
            setItems(items.filter((item, i) => { 
                return  item!== email && i !== index
            }))
        }

    };

    useEffect(() => {
        const emailsValidCheck = items.map(item => {
            return !emailValidation(item);
        })

        const checkInvalidEmails = emailsValidCheck.includes(false);

        if(!checkInvalidEmails) {
            setEmailError(null)
        }

    }, [items])

    // submit emails for sent invitation
    const inviteSubmit = (data) => {

        if(inputValue){
            const check = emailValidation(inputValue);

            if(check) {
                items.push(inputValue);
                setInputValue('')
            } else {
                setEmailError("Enter a valid email");
                return;   
            }
        }

        if (items.length === 0){
            setEmailError("Enter a valid email");
            return;     
        }

        const emailsValidCheck = items.map(item => {
            return !emailValidation(item)
        })

        const checkInvalidEmails = emailsValidCheck.includes(false);

        if(checkInvalidEmails) {
            setEmailError("Please remove or edit invalid emails");
            // setDbClicked(false)
            return;
        }


        data['userEmail'] = items;
        data["userId"] = userState.user.id;
        data["organizationId"] = organizationId;
        data["inviteCode"] = "";
        data["clientDate"] = new Date().toString();
        
        setError('');
        setEmailExistsMsg('');
        setEmailError('');
        setExistingEmails([]);
        inviteUser(data)
            .then(res => {
                if (res.data.isSuccess === true) {
                    
                    if(mountedRef){
                        toast({ type: "success", text: res.data.message })
                        setEmails([])
                        setItems([]);
                    }
                } else {
                    
                    if(mountedRef){
                        setEmailExistsMsg(res.data.message);
                        setExistingEmails(res.data.userEmail);
                    }
                }
            })
            .catch(err => {
                console.log(err.response);
                
                toast({ type: "error", text: err.response.statusText })
            })
    }


    return (

        <div className="invitation-container">

            <div className="col-xl-8 col-lg-8 col-md-8 pl-0 pr-0">
                <div className="card shadow mb-4 org-card">
                    <div className="card-header">
                        <div className="card-body">

                            <form>

                                <div className="row mb-3">
                                    <div className="col">
                                        <div className="form-outline">

                                            <label className="form-label subText" htmlFor="email">Email Address</label>
                                            <>
                                                <input
                                                    className={"multiple-input mb-2 " + (error && " has-error")}
                                                    value={inputValue}
                                                    placeholder="Type or paste email addresses and press `Enter`..."
                                                    onKeyDown={handleKeyDown}
                                                    onChange={handleChange}
                                                    onPaste={handlePaste}
                                                />

                                                


                                                {   error ? <span className="error-msg">{error}</span>
                                                          : emailError ? <span className="error-msg">{emailError}</span> 
                                                          : emailExistsMsg ?   
                                                            <span className="error-msg">
                                                                {emailExistsMsg}
                                                                <ul>
                                                                    {
                                                                        existingEmails.map(email=>(
                                                                            <li key={email}>{email}</li>
                                                                        ))
                                                                    }
                                                                </ul>
                                                            </span>  : ''
                                                }
                                                {
                                                    items.length > 0 
                                                    ?   <span className="removeAllEmailsIcon material-icons float-right custom-tooltip"
                                                             onClick={()=>setItems([])}
                                                        >
                                                            <span className='tooltiptext'>Remove all</span>
                                                            highlight_off</span>
                                                    : ''
                                                }
                                                <div className="emails-list-box">
                                                
                                                    {
                                                    items.map((item,i) => {

                                                            const check = emailValidation(item);

                                                            return (
                                                                <div onDoubleClick={()=>handleDbClick(item,i)} 
                                                                    className={"mt-2 " + (check === true ? 'tag-item' : 'err-tag-item')} key={i}
                                                                    title= "Double tab to edit or presss x to remove"
                                                                >
                                                                    {item}

                                                                    <button type="button"className="button"onClick={() => handleDelete(item,i)}>
                                                                        &times;
                                                                    </button>
                                                                </div>
                                                            )                                                                                                
                                                        })
                                                    }
                                                </div>
                                            </>

                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-outline">
                                            <div className="form-group">
                                                <label className="form-label subText" htmlFor="role">User's Role</label>

                                                <select style={{ height: '42px' }} className="form-control mb-2" id="role"
                                                    {...register("roleId", { required: true })}>
                                                    {
                                                        allRoles.map(role => (
                                                            <option key={role.id} value={role.id}>{role.name}</option>
                                                        ))
                                                    }
                                                </select>


                                                {
                                                    errors.role ? <span className="error-msg">Please select a role</span> : ''
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-checkbox">
                                    <div className="form-check">
                                    <label className="custom-control overflow-checkbox">
                                        <input type="checkbox" className="form-check-input mt-2 overflow-control-input" id="exampleCheck1"
                                            {...register("restrictInvitedEmail")} />
                                             <span className="overflow-control-indicator"></span>
                                    </label>
                                        <label className="form-check-label subText" htmlFor="exampleCheck1">
                                            Force user's to sign-up using the same email address as the invitation
                                        </label>
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col org-buttons">
                                        <button type="button" onClick={handleSubmit(inviteSubmit)} className="btn btn-block sendInvite-btn mb-2 mt-4">Send Invites</button>
                                    </div>
                                </div>

                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InvitationContainer
