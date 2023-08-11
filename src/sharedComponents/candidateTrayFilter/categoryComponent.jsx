import React, { useEffect } from 'react'

function CategoryComponent({ category, onSelectCategory, allLeafNodes, selectFilter }) {
    const selectCategory = (category) => {
        onSelectCategory(false, category);
    }

    useEffect(() => {
        getCheckedData();
    }, [])

    const getCheckedData = () => {
        if (localStorage.getItem('filterArrayList')) {
            let criteriaList = JSON.parse(localStorage.getItem('filterArrayList'));
            if (criteriaList.length > 0) {
                criteriaList.map(obj => {
                    if (document.getElementById(obj.filterName)) {
                        return document.getElementById(obj.filterName).checked = true;
                    }
                })
            }
        }
    }
    const selectCriteria = (selectedData, evt) => {
        selectFilter(selectedData, evt)

    }
    const checkIsSelected = (data) => {
        if (localStorage.getItem('filterArrayList')) {
            let criteriaList = JSON.parse(localStorage.getItem('filterArrayList'));
            if (criteriaList?.find(obj => obj.filterName.toLowerCase() === data.filterName.toLowerCase())) {
                return true;
            } else {
                return false;
            }

        }
    }

    return (
        <div className="card-body overflow-body">
            <div className="main-category">
                {category.map(obj => {
                    return (
                        <div key={obj.$id}>
                            <div className="row" onClick={() => selectCategory(obj)} >
                                <div className="col-xl-10 col-lg-10 col-md-10 filter-text">{obj.filterName}</div>
                                <div className="col-xl-2 col-lg-2 col-md-2"><span className="material-icons filter-arrow">arrow_forward_ios</span></div>
                            </div>
                            {
                                allLeafNodes.map(item => {
                                    return (
                                        item.mainParent === obj.mainParent && item.leafNode && checkIsSelected(item) && <div className="form-check filter-checkboxes" key={item.$id}>
                                            <label className="custom-control overflow-checkbox">

                                                <input className="form-check-input career-checkbox overflow-control-input" type="checkbox"
                                                    onChange={(e) => {
                                                        selectCriteria(item, e)
                                                    }}
                                                    value='' id={item.filterName} />
                                                <span className="overflow-control-indicator"></span>
                                            </label>
                                            <label className="form-check-label text-5 ml-2" htmlFor={item.id}>{item.filterName}</label>
                                        </div>)
                                })
                            }
                        </div>


                    )
                })}


            </div>
            {/* {location.pathname!=='/portal/dashboard'&&<div className="return-btn" onClick={navigateToDashboard}>
                <a  className="link-decoration-none">RETURN</a>
            </div>}  */}
        </div>


    )
}

export default CategoryComponent
