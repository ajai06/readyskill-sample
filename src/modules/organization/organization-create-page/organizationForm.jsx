import React, { useEffect, useState, useRef } from 'react';

import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';

import { useForm } from 'react-hook-form';

import WithLayout from '../../../sharedComponents/hoc/withLayOut';
import DashboardHeaderComponent from '../../../sharedComponents/dashboardHeader/dashboardHeaderComponent';

// import { getOrganization, addOrganization, updateOrganization, getOrganizationTypes } from '../../../services/apiServices';

import { getOrganization, addOrganization, updateOrganization, getOrganizationTypes, getExternalLoginTypes } from '../../../services/organizationServices';


import { useToastDispatch } from '../../../context/toast/toastContext';

import './organization.scss';

function OrganizationForm() {

    const navigate = useNavigate();
    const { id } = useParams();


    const toast = useToastDispatch();

    const { register, formState: { errors }, setValue, handleSubmit, watch, reset } = useForm();

    const [editMode, setEditMode] = useState(false);
    const [organizationTypes, setOrganizationTypes] = useState([]);
    const [isGoogle, setGoogle] = useState(false);
    const [externalLoginTypeList, setExternalLogin] = useState([]);
    const [selectedLoginTypes, setSelectedLoginType] = useState([]);
    const [domainName, setDomainName] = useState([]);

    const mountedRef = useRef(false);

    useEffect(() => {
        mountedRef.current = true
        return () => {
            mountedRef.current = false
        }
    }, []);

    useEffect(() => {

        (async () => {
            try {
                const res = await getOrganizationTypes();
                if (mountedRef) {
                    setOrganizationTypes(res.data)
                }
            } catch (error) {
                console.log(error.response)
            }

            if (id && mountedRef) {
                setEditMode(true);
                getOrganization(id)
                    .then(res => {
                        patchValues(res.data);
                    })
                    .catch(err => {
                        console.log(err.response);
                    })
            }
        })()
        getLoginTypes();
    }, []);

    // service address same as mailing address
    const mailingAddress = watch("mailingAddress");
    const [checked, setChecked] = useState(false);

    React.useEffect(() => {
        if (checked) {
            setValue("serviceAddress", mailingAddress);
        }
    }, [mailingAddress]);


    const checkboxWatch = watch("checkBox");

    React.useEffect(() => {
        if (checkboxWatch) {
            if (mountedRef) {
                setChecked(true);
                setValue("serviceAddress", mailingAddress);
            }
        } else {
            if (mountedRef) {
                setChecked(false);
                setValue("serviceAddress", "");
            }
        }
    }, [checkboxWatch]);

    const getLoginTypes = () => {
        getExternalLoginTypes()
            .then((res) => {
                if (res.data) {
                    if (mountedRef.current) {
                        setExternalLogin(res.data);
                    }
                }
            })
    }


    // add new organization submit
    const createOrganization = (data) => {
        addOrganization(data)
            .then(res => {
                if (mountedRef.current) {
                    setTimeout(() => {
                        toast({ type: "success", text: "Organization added successfully" })
                        if (res.status === 200) {
                            navigate("/portal/organization")
                        }
                    }, 500)
                }
            })
            .catch(err => {
                if (mountedRef.current) {
                    console.log(err.response);
                    toast({ type: "error", text: err.response.statusText })
                }

            })
    }

    // update organization submit
    const editOrganization = (data) => {
        data['id'] = id;
        data['organizationExternalLoginMapping'] = selectedLoginTypes;
        updateOrganization(id, data)
            .then(res => {
                if (mountedRef.current) {
                    setTimeout(() => {
                        toast({ type: "info", text: "Organization updated successfully" })
                        if (res.status === 204) {
                            navigate(-1);
                        }
                    }, 500)
                }
            })
            .catch(err => {
                if (mountedRef.current) {
                    console.log(err.error);
                    toast({ type: "error", text: err.response.statusText })
                }
            })
    }

    // patching values of organization
    const patchValues = (data) => {
        if (mountedRef.current) {
            setValue("organizationName", data.organizationName);
            setValue("dba", data.dba);
            setValue("mailingAddress", data.mailingAddress);
            setValue("serviceAddress", data.serviceAddress);
            setValue("administrativeUser", data.administrativeUser);
            setValue("administrativeUserEmail", data.administrativeUserEmail);
            setValue("organizationTypeId", data.organizationTypeId);
            checkExternalLogins(data);
            if (data.mailingAddress === data.serviceAddress) {
                setChecked(true)
                setValue("checkBox", true)
            } else {
                setChecked(false);
                setValue("checkBox", false)
            }
        }
    }


    const checkExternalLogins = (data) => {
        if (data.organizationExternalLoginMapping) {
            data.organizationExternalLoginMapping.map(login => {
                if (document.getElementById(login.externalLoginTypeId) && login.isActive) {
                    if (login.externalLoginType.typeName === "Google" && login.externalLoginType.status === true) {
                        setGoogle(true);  
                    }
                    setDomainName(login.domainName);
                    return document.getElementById(login.externalLoginTypeId).checked = true;
                } else {
                    return false;
                }
            })
        }
        setSelectedLoginType(data.organizationExternalLoginMapping);
    }

    const onSelectLoginType = (item, event) => {
        if (event.target.checked) {
            if (selectedLoginTypes.length > 0) {
                setSelectedLoginType(selectedLoginTypes.filter(obj => {
                    if (obj.externalLoginTypeId === item.id) {
                        obj.isActive = !obj.isActive;
                    }
                    if (item.typeName === "Google") {
                        setGoogle(true);
                    }
                    return obj;
                }))
            }
        } else {
            if (selectedLoginTypes.length > 0) {
                setSelectedLoginType(selectedLoginTypes.filter(obj => {
                    if (obj.externalLoginTypeId === item.id) {
                        obj.isActive = !obj.isActive;
                    }
                    if (item.typeName === "Google") {
                        setGoogle(false);
                    }
                    return obj;
                }))
            }
        }
    }
    const setDomainForExternalLogin = (domainName) => {
        setDomainName(domainName);
        setSelectedLoginType(selectedLoginTypes.filter(obj => {
           // if (obj.externalLoginType.typeName === "Google") {
                obj.domainName = domainName;
           // }
            return obj;
        }))
    }
    const CheckIsAuthAvailable=()=>{
        if(selectedLoginTypes.find(obj=>obj.isActive)){
            return false;
        }else{
            return true;
        }
    }

    return (

        <div id="main" className="organization-form-container">

            <DashboardHeaderComponent headerText={editMode ? "Edit Organization" : "Add new organization"} />

            {
                editMode ? <div className="back-btn" onClick={() => navigate(-1)}>
                    <span className="material-icons org-back-arrow">arrow_back_ios</span>
                    <span className="back-text">Back</span>
                </div>
                    : <div className="back-btn" onClick={() => navigate("/portal/organization")}>
                        <span className="material-icons org-back-arrow">arrow_back_ios</span>
                        <span className="back-text">Back</span>
                    </div>
            }
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-8 col-lg-8 col-md-8 p-0">
                        <div className="card shadow mb-4 org-card">
                            <div className="card-header">
                                <div className="card-body">
                                    <form>
                                        <div className="row mb-3">
                                            <div className="col">
                                                <div className="form-outline">
                                                    <label className="form-label subText" htmlFor="legal_name">Legal Name</label>
                                                    <input disabled={editMode ? true : false} type="text" id="legal_name" className="form-control mb-2" placeholder="Legal Name"
                                                        {...register("organizationName", { required: true })}
                                                    />
                                                    {errors.organizationName ? <span className="error-msg">Organization name required</span> : ''}
                                                </div>
                                            </div>

                                            <div className="col">
                                                <div className="form-outline">
                                                    <label className="form-label subText" htmlFor="dba">DBA (if applicable)</label>
                                                    <input type="text" id="dba" className="form-control mb-2" placeholder="DBA"
                                                        {...register("dba")}
                                                    />
                                                </div>
                                            </div>

                                        </div>

                                        <div className="row mb-3">

                                            <div className="col">
                                                <div className="form-outline">
                                                    <label className="form-label subText" htmlFor="mailing_address">Mailing Address</label>
                                                    <textarea className="form-control mb-2" id="mailing_address" rows="4" placeholder="Mailing Address"
                                                        {...register("mailingAddress", { required: true })}
                                                    />
                                                    {errors.mailingAddress ? <span className="error-msg">Mailing address required</span> : ''}
                                                </div>
                                            </div>

                                            <div className="col">
                                                <div className="form-outline">
                                                    <div className="form-checkbox">
                                                        <label className="form-label subText" htmlFor="service_address">Service Address</label>
                                                        <div className="form-check ml-3">
                                                            <label className="custom-control overflow-checkbox">
                                                                <input type="checkbox" {...register("checkBox")} className="form-check-input overflow-control-input" id="exampleCheck1" />
                                                                <span className="overflow-control-indicator"></span>
                                                            </label>
                                                            <label className="form-check-label subText" htmlFor="exampleCheck1">Same as Mailing Address</label>
                                                        </div>
                                                    </div>
                                                    <textarea className="form-control mb-2" id="service_address" disabled={checked ? true : false} rows="4"
                                                        placeholder="Service Address" {...register("serviceAddress", { required: true })}
                                                    />
                                                    {errors.serviceAddress ? <span className="error-msg">Serivce address required</span> : ''}

                                                </div>
                                            </div>

                                        </div>

                                        <div className="row mb-3">

                                            <div className="col">
                                                <div className="form-outline">
                                                    <label className="form-label subText" htmlFor="administrative_user">Administrative User</label>
                                                    <input type="text" id="administrative_user" className="form-control mb-2"
                                                        placeholder="Administrative User" {...register("administrativeUser", { required: true })}
                                                    />
                                                    {errors.administrativeUser ? <span className="error-msg">Administrative name required</span> : ''}
                                                </div>
                                            </div>

                                            <div className="col">
                                                <div className="form-outline">
                                                    <label className="form-label subText" htmlFor="administrative_user_email">
                                                        Administrative User’s Email Address
                                                    </label>
                                                    <input type="email" id="administrative_user_email" className="form-control mb-2 mt-0" placeholder="Email Address"
                                                        {...register("administrativeUserEmail",
                                                            { required: true, pattern: /^(([^<>()[\]\\.,;:+\s@"]+(\.[^<>()[\]\\.,;:+\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ })} />
                                                    {errors.administrativeUserEmail?.type === "required"
                                                        ? <span className="error-msg">Administrative email required</span>
                                                        : errors.administrativeUserEmail?.type === "pattern"
                                                            ? <span className="error-msg">Enter valid email</span>
                                                            : ''
                                                    }
                                                </div>
                                            </div>

                                        </div>

                                        <div className="form-group">
                                            <label className="form-label subText" htmlFor="select1">Organization Type</label>
                                            <select className="form-control mb-2" disabled={editMode ? true : false} id="select1" {...register("organizationTypeId", { required: true })}>

                                                <option value="">Please select</option>
                                                {
                                                    organizationTypes.map(org => (
                                                        <option key={org.id} value={org.id}>{org.type}</option>
                                                    ))
                                                }
                                            </select>
                                            {errors.organizationTypeId ? <span className="error-msg">Organization type required</span> : ''}
                                        </div>
                                        
                                        {editMode && <div className="form-group">
                                            <label className="form-label subText" htmlFor="select1">Authorization</label>
                                            <div className="row">
                                                {externalLoginTypeList.map(item => (
                                                    <div key={item.id} className="form-check ml-3">
                                                        <label className="custom-control overflow-checkbox">
                                                            <input type="checkbox" onChange={(event) => onSelectLoginType(item, event)} className="form-check-input overflow-control-input" id={item.id} />
                                                            <span className="overflow-control-indicator"></span>
                                                        </label>
                                                        <label className="form-check-label subText" htmlFor="exampleCheck1">{item.typeName}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>}
                                        <div className="row mb-3">
                                            <div className="col">
                                                <div className="form-outline">
                                                    <label className="form-label subText" htmlFor="domain">Domain</label>
                                                    <input className="form-control mb-2" onChange={(e) => setDomainForExternalLogin(e.target.value)} value={domainName} id="domain" rows="4" placeholder="Domain(optional)" />
                                                </div>
                                            </div>
                                        </div>


                                        <div className="row mb-3">
                                            <div className="col org-buttons">
                                                {
                                                    editMode
                                                        ? <button disabled={CheckIsAuthAvailable()} type="button" onClick={handleSubmit(editOrganization)}
                                                            className="btn btn-block create-btn mb-2 mt-4">UPDATE</button>
                                                        : <button type="button" onClick={handleSubmit(createOrganization)}
                                                            className="btn btn-block create-btn mb-2 mt-4">CREATE</button>
                                                }
                                                {/* <button type="button" onClick={()=>reset()} className="btn btn-block clear-btn">clear</button>    */}
                                            </div>
                                        </div>

                                    </form>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    )
}

export default WithLayout(OrganizationForm)
