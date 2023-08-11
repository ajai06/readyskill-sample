import React from 'react'

import './dashboardHeader.scss';

function DashboardHeaderComponent(props) {
    return (
        <>
            <div className="d-sm-flex mb-5 pl-3 header-component">
                <h1 className="h5 headText">{props.headerText ? props.headerText : ''}</h1>
            </div>
        </>

    )
}

export default DashboardHeaderComponent
