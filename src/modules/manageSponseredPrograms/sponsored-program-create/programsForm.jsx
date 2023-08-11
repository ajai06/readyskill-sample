import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from 'react-hook-form';

import WithLayout from '../../../sharedComponents/hoc/withLayOut';
import DashboardHeaderComponent from '../../../sharedComponents/dashboardHeader/dashboardHeaderComponent';
import { UserAuthState } from '../../../context/user/userContext';
import { getOrganizationList } from '../../../services/organizationServices';

import './programform.scss';
import { createProgram, getProgramDetailsById, updateProgram } from '../../../services/sponsoredProgramService';
import { useToastDispatch } from '../../../context/toast/toastContext';

import {useIsMounted} from  "../../../utils/useIsMounted"

function ProgramsForm() {
    const navigate = useNavigate();
    const { register, formState: { errors }, setValue, handleSubmit, watch } = useForm({ mode: 'onChange'});
    const userState = UserAuthState();
    const [organizations, setOrganizations] = useState([]);
    const toast = useToastDispatch();
    const checkboxWatch = watch("IsSponsoredProgram");
    const { id } = useParams();
    const isMounted = useIsMounted();



    useEffect(() => {
        getAllOrganizationList();
        if (id) {
            setTimeout(() => {
                getProgramDetailsWithId();
            }, 200); 
        }
        
    }, [])



    useEffect(() => {
        if (!checkboxWatch) {
            if (isMounted()) {
                setValue("SponsoredOrgID", "");
            }
        }
    }, [checkboxWatch])

    const getAllOrganizationList = () => {
        getOrganizationList(userState.user.id)
            .then(res => {
                if (isMounted()) {
                    setOrganizations(res.data);
                }
            })
            .catch(err => {
                console.log(err.response)
            });
    }

    const getProgramDetailsWithId = () => {
        getProgramDetailsById(id)
            .then((res) => {
                if (res.data) {
                    if (isMounted()) {
                        patchValues(res.data);
                    }
                }
            })
    }

    const patchValues = (data) => {
        setValue("Institution", data.institution);
        setValue("CarrerPathway", data.carrerPathway);
        setValue("EnrollmentDate", new Date(data.enrollmentDate).toISOString().split('T')[0]);
        setValue("GraduationDate", new Date(data.enrollmentDate).toISOString().split('T')[0]);
        setValue("ProgramStartDate", new Date(data.enrollmentDate).toISOString().split('T')[0]);
        setValue("CarrerSpecialization", data.carrerSpecialization);
        setValue("Counselor", data.counselor);
        setValue("IsSponsoredProgram", data.isSponsoredProgram);
        setValue("SponsoredOrgID", (data.sponsoredOrgID === null || data.sponsoredOrgID === "") ? "" : data.sponsoredOrgID);
        setValue("StudentUserID", data.studentUserID);
        setValue("ProgramID", data.programID);

    }


    const createProgramDetails = (data) => {
        data.StudentUserID = "DA3C920C-18D2-45B4-8C13-54283F30FD9F";
        data.ProgramID = "3FA85F64-5717-4562-B3FC-2C963F66AFA1";
        if (checkboxWatch) {
            if (!data.SponsoredOrgID.length > 0) {
                toast({ type: "warning", text: "Please select organization" });
                return;
            }
        } else {
            data.SponsoredOrgID = null;
        }
        createProgram(data)
            .then((res) => {
                if (res.status === 200) {
                    toast({ type: "success", text: "Program created successfully" });
                    setTimeout(() => {
                        navigate(-1);
                    }, 100);
                }
            })
            .catch(err => console.log(err));

    }

    const updatePrograme = (data) => {
        data['id']=id;
        if (checkboxWatch) {
            if (!data.SponsoredOrgID.length > 0) {
                toast({ type: "warning", text: "Please select organization" });
                return;
            }
        } else {
            data.SponsoredOrgID = null;
        }
        updateProgram(id, data)
            .then((res => {
                if (res.status === 204) {
                    if (isMounted()) {
                        toast({ type: "success", text: "Program updated successfully" });
                        setTimeout(() => {
                            navigate(-1);
                        }, 100);
                    }
                }
            }))
            .catch(err => console.log(err));
    }
    return (
        <div id="main" className="program-form-container">
            <DashboardHeaderComponent headerText="Add New Program" />
            <div className="back-btn" onClick={() => navigate(-1)}>
                <span className="material-icons org-back-arrow">arrow_back_ios</span>
                <span className="back-text">Back</span>
            </div>
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
                                                    <label className="form-label subText" >Institution</label>
                                                    <input type="text" {...register("Institution", { required: true })} className="form-control mb-2" placeholder="Institution" />
                                                    {errors.Institution ? <span className="error-msg">Institution  required</span> : ''}
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="form-outline">
                                                    <label className="form-label subText" >Career Pathway</label>
                                                    <input type="text" {...register("CarrerPathway", { required: true })} className="form-control mb-2" placeholder="Career pathway" />
                                                    {errors.CarrerPathway ? <span className="error-msg">Career Pathway required</span> : ''}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col">
                                                <div className="form-outline">
                                                    <label className="form-label subText" >Enrollment Date</label>
                                                    <input type="date" onKeyDown={(e) => e.preventDefault()} {...register("EnrollmentDate", { required: true })} className="form-control mb-2" />
                                                    {errors.EnrollmentDate ? <span className="error-msg">Enrollment date required</span> : ''}
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="form-outline">
                                                    <label className="form-label subText" >Start Date</label>
                                                    <input type="date" onKeyDown={(e) => e.preventDefault()} {...register("ProgramStartDate", { required: true })} className="form-control mb-2" />
                                                    {errors.ProgramStartDate ? <span className="error-msg">Program start date required</span> : ''}
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="form-outline">
                                                    <label className="form-label subText" >Graduation Date</label>
                                                    <input type="date" onKeyDown={(e) => e.preventDefault()} {...register("GraduationDate", { required: true })} className="form-control mb-2" />
                                                    {errors.GraduationDate ? <span className="error-msg">Graduation date required</span> : ''}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col">
                                                <div className="form-outline">
                                                    <label className="form-label subText" >Career Specialization</label>
                                                    <input type="text" {...register("CarrerSpecialization", { required: true })} className="form-control mb-2" placeholder="Career specialization " />
                                                    {errors.CarrerSpecialization ? <span className="error-msg">Career specialization required</span> : ''}
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="form-outline">
                                                    <label className="form-label subText" >Counselor</label>
                                                    <input type="text" {...register("Counselor", { required: true })} className="form-control mb-2" placeholder="Counselor" />
                                                    {errors.Counselor ? <span className="error-msg">Counselor required</span> : ''}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="form-check ml-3">
                                                <label className="custom-control overflow-checkbox">
                                                    <input type="checkbox" {...register("IsSponsoredProgram")} className="form-check-input overflow-control-input" />
                                                    <span className="overflow-control-indicator"></span>
                                                </label>
                                                <label className="form-check-label subText" htmlFor="exampleCheck1">Sponsored Program?</label>
                                            </div>

                                        </div>

                                        {checkboxWatch && <div className="row mb-3">
                                            <div className="form-group col">
                                                <label className="form-label subText" htmlFor="select1">Organization</label>
                                                <select className="form-control mb-2"  {...register("SponsoredOrgID")}>

                                                    <option value="">Please select</option>
                                                    {
                                                        organizations.map(org => (
                                                            <option key={org.id} value={org.id}>{org.organizationName}</option>
                                                        ))
                                                    }
                                                </select>

                                            </div>
                                        </div>}



                                        <div className="row mb-3">
                                            <div className="col org-buttons">
                                                {id ? <button type="button" className="btn btn-block create-btn mb-2 mt-4" onClick={handleSubmit(updatePrograme)}>UPDATE</button> :
                                                    <button type="button" className="btn btn-block create-btn mb-2 mt-4" onClick={handleSubmit(createProgramDetails)}>CREATE</button>}

                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>);
}

export default WithLayout(ProgramsForm);
