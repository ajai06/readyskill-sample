import React, { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { getLearnerNameDetails } from '../../../../services/learnersServices';

import DashboardHeaderComponent from '../../../../sharedComponents/dashboardHeader/dashboardHeaderComponent';

import GlobalAdminLayOut from '../../../../sharedComponents/hoc/globalAdminLayOut';
import LearnersDetailsAdminComponent from './learnersDetailsAdmincomponent';

import "../../admindashboard.scss";
import { useIsMounted } from '../../../../utils/useIsMounted';

function LearnersDetailsAdminContainer() {
    const { id } = useParams();
    const [learnerData, setLearnerData] = useState();
    const isMounted = useIsMounted();


    useEffect(() => {
        getLearnerInfo();
    }, [])
    const getLearnerInfo = () => {
        getLearnerNameDetails(id)
            .then(res => {
                if (isMounted()) {
                    setLearnerData(res.data);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    const refreshData = () => {
        getLearnerInfo();
    }
    return (
        <div id="main" className='learners-details-main'>
            <DashboardHeaderComponent headerText="Learners" />
            <div className="bread-crumb">
                <NavLink to="/portal/admin/admin_dashboard" className="smallText text-uppercase text-decoration-none navlink">ADMIN DASHBOARD{' > '}</NavLink>
                <NavLink to="/portal/admin/learners_list" className="smallText text-uppercase text-decoration-none navlink">LEARNERS</NavLink>
                {learnerData && <a className="smallText text-uppercase navlink text-decoration-none active active-breadcrumb">{' > '}{learnerData.firstName} {learnerData.lastName}</a>}
            </div>
            <LearnersDetailsAdminComponent refreshName={refreshData} />
        </div>
    )
}

export default GlobalAdminLayOut(LearnersDetailsAdminContainer);