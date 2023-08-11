import React from 'react'
import HeaderComponent from './headerComponent';
import SubHeadComponent from './subHeadComponent';

function LeafNodeComponent({ leafCategory, headerName, onSelectLeafCategory, subHeaderName }) {
    const onSelectLeaf = (data) => {
        onSelectLeafCategory(true, data);
    }
    const back = () => {
        onSelectLeafCategory(false)
    }
    return (
        <div className="card shadow mb-4 filter-card">
            <div className="card-header">
                <span className="material-icons filter-arrow back-arrow" onClick={back}>arrow_back_ios</span>
                <HeaderComponent headerName={headerName} />
            </div>
            <div className="card-body overflow-body">
                <div className="main-category">
                    <SubHeadComponent subHeader={subHeaderName} />
                    {leafCategory.map(data => {
                        return (<div className="row" key={data.$id} onClick={()=>{onSelectLeaf(data)}}>
                            <div className="col-xl-10 col-lg-10 col-md-10 industries-filter-sub">{data.filterName}</div>
                            <div className="col-xl-2 col-lg-2 col-md-2"><span className="material-icons filter-arrow">arrow_forward_ios</span></div>
                        </div>);
                    })}


                </div>
            </div>
        </div>
    )
}

export default LeafNodeComponent
