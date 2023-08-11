import React from 'react';
import { useNavigate } from 'react-router-dom'

import DashboardHeaderComponent from '../../sharedComponents/dashboardHeader/dashboardHeaderComponent';
import WithLayout from '../../sharedComponents/hoc/withLayOut';

import './settings.scss';

function SettingsContainer() {

    const navigate = useNavigate();

    return (
        <div id="main">

           <DashboardHeaderComponent headerText="Settings"/>        
           <div className="container-fluid">
                <div className="row mb-3">
                    <div className="col org-buttons p-0"> 
                        <button type="button" onClick={()=>navigate("/portal/organization")} className="btn btn-block list-btn mb-2 mt-4 float-left">
                            Organization list
                        </button> 
                    </div>
                </div>
            </div>

            

            <div className="row mb-3">
                <div className="col org-buttons"> 
                    <button type="button" onClick={()=>navigate("/portal/sent_invitation")} className="btn btn-block list-btn mb-2 mt-4 float-left">
                        Invitation
                    </button> 
                </div>
            </div>

            <div className="row mb-3">
                <div className="col org-buttons"> 
                    <button type="button" onClick={()=>navigate("/portal/invite_code_generator")} className="btn btn-block list-btn mb-2 mt-4 float-left">
                        Invitation code generator
                    </button> 
                </div>
            </div>

        </div>
        
    )
}

export default WithLayout(SettingsContainer)
