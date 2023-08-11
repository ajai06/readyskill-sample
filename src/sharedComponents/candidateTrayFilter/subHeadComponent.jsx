import React from 'react'

function SubHeadComponent(props) {
    return (
        <div className="row">
            <div className="col-xl-10 col-lg-10 col-md-10 filter-text">{props.subHeader}</div>
        </div>
    )
}

export default SubHeadComponent
