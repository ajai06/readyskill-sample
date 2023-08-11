import React from 'react'

import CandiadateTrayfilterContainer from '../../sharedComponents/candidateTrayFilter/candiadateTrayfilterContainer'
import DashboardHeaderComponent from '../../sharedComponents/dashboardHeader/dashboardHeaderComponent'
import WithLayout from '../../sharedComponents/hoc/withLayOut'
import Breadcrumbs from '../../sharedComponents/BreadCrumbs/breadCrumbs'
function RecruitingComponent() {
    return (
        <div id="main">
            <DashboardHeaderComponent headerText="Recruiting" />
            <Breadcrumbs/>
            <CandiadateTrayfilterContainer />
        </div>
    )
}

export default WithLayout(RecruitingComponent)
