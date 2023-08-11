import React, { useEffect, useState, useRef } from 'react';

import { useNavigate } from "react-router-dom";



import { UserAuthState } from '../../../context/user/userContext';

// import { deleteOrganization } from '../../../services/apiServices';

import { deleteOrganization } from '../../../services/organizationServices';


import { useToastDispatch } from '../../../context/toast/toastContext';

import './organization.scss';

const OrganizationInfo = React.memo(({usersNo, organizationData}) => {

    const userState = UserAuthState();
    const navigate = useNavigate();
    const toast = useToastDispatch();
    

    const [organization, setOrganization] = useState([]);
    const [organizationType, setOrganizationType] = useState([]);

    const mountedRef = useRef(false);

    useEffect(() => {
        mountedRef.current = true
        return () => {
            mountedRef.current = false
        }
    }, []);

    useEffect(() => {
        if(mountedRef){
            setOrganization(organizationData);
            setOrganizationType(organizationData.organizationTypeInfo)
        }
    }, [])

    // organization delete
    const organization_delete = () => {

        
        deleteOrganization(organization.id, userState.user.id)
        .then(res=>{
            setTimeout(()=>{
                if(mountedRef){
                    toast({type:"success", text: "Organization deleted successfully"});
                    navigate("/portal/organization");
                }
                
            },300)
        })
        .catch(err=>{
            console.log(err.response)
        })
    }

    return (
        <div className="org-detailed-component">
            <div className="col-xl-8 col-lg-8 col-md-8 p-0 mb-5">
                <div className="card shadow org-detailed-card mb-4">
                    <div className="card-header">
                        <div className="org-details-head">
                            <div className="w-50">
                                <div className="text3 mt-1 pb-2">{organization.organizationName}</div>
                                <p className="subText">{usersNo} Users</p>
                            </div>
                            <div className="w-100 text-right mt-4">
                                { 
                                    <span
                                        className="material-icons grey-icon edit-org custom-tooltip"
                                       
                                        onClick={()=>navigate(`/portal/edit_organization/${organization.id}`)}
                                    >
                                        <span className='tooltiptext'>Edit organization</span>
                                        edit
                                    </span> 
                                }
                                {
                                    userState.user.organization.organizationId !== organization.id && userState.role_GlobalAdmin
                                     ? <span
                                            className="material-icons delete-org custom-tooltip"
                                            data-toggle="modal"
                                            data-target="#delete-modal"
                                        >
                                            <span className='tooltiptext'>Delete organization</span>
                                            delete
                                        </span>
                                    : ''
                                }
                                
                            {/* modal starts */}
                            <div className="modal fade" id="delete-modal" tabIndex="-1" aria-labelledby="delete-modal" aria-hidden="true">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="delete-modalLabel">Are you sure?</h5>
                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div className="modal-body text-center">
                                            Are you sure you want to delete this organization?
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                            <button type="button" onClick={organization_delete} className="btn btn-danger" data-dismiss="modal" >Delete</button>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                                {/* modal ends */}
                            </div>
                        </div>
                    </div>
                    <div className="card-body p-0">
                        <div className="d-flex py-4 px-2">
                            <div className="col-6">
                                <div className="org-subDetails d-flex">
                                    <p className="bold-text-2">Legal Name :</p>
                                    <p className="subText ml-3">{organization.organizationName}</p>
                                </div>
                                <div className="org-subDetails d-flex">
                                    <p className="bold-text-2">DBA  :</p>
                                    <p className="subText ml-3">{organization.dba}</p>
                                </div>
                                <div className="org-subDetails d-flex">
                                    <p className="bold-text-2">Organization Type :</p>
                                    <p className="subText ml-3">{organizationType.type}</p>
                                </div>
                                <div className="org-subDetails d-flex">
                                    <p className="bold-text-2">Administrative User :</p>
                                    <p className="subText ml-3">{organization.administrativeUser}</p>
                                </div>
                                <div className="org-subDetails d-flex">
                                    <p className="bold-text-2">Administrative User Email :</p>
                                    <p className="subText ml-3">{organization.administrativeUserEmail}</p>
                                </div>
                            </div>
                            <div className="col-6">
                            
                                <div className="org-subDetails d-flex">
                                    <p className="bold-text-2">Mailing Address :</p>
                                    <p className="subText ml-3">{organization.mailingAddress}</p>
                                </div>
                                <div className="org-subDetails d-flex">
                                    <p className="bold-text-2">Service Address :</p>
                                    <p className="subText ml-3">{organization.serviceAddress}</p>
                                </div>
                                
                            </div>
                        </div>
                    
                    </div>
                </div>
            </div>
        </div>
    )
})

export default React.memo(OrganizationInfo)
