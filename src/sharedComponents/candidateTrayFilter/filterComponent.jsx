import React, { useState, useEffect } from 'react'

import HeaderComponent from './headerComponent';
import SubHeadComponent from './subHeadComponent';

function FilterComponent({ filterCriteria, backFromFilter, selectFilter }) {
    const [header, setHeader] = useState('');
    const [subHead, setSubHeader] = useState('');

    const back = () => {
        if (filterCriteria[0].filterLevel === 1) {
            backFromFilter(false, 1);
        } else {
            backFromFilter(false);
        }

    }
    const selectCriteria = (selectedData, evt) => {
        selectFilter(selectedData, evt)

    }

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
    useEffect(() => {
        if (filterCriteria) {
            setHeader(filterCriteria[0].mainHeadText);
            setSubHeader(filterCriteria[0].subHeadText);
            getCheckedData();
        }
    }, [])
    return (
        <div className="card shadow mb-4 filter-card">
            <div className="card-header">
                <span className="material-icons filter-arrow back-arrow" onClick={back}>arrow_back_ios</span>
                <HeaderComponent headerName={header} />
            </div>
            <div className="card-body overflow-body">
                <div className="main-category">
                    <SubHeadComponent subHeader={subHead} />
                    {
                        filterCriteria.map(data => {
                            return (<div className="form-check filter-checkboxes" key={data.$id}>
                                <label className="custom-control overflow-checkbox">
                                    <input className="form-check-input career-checkbox overflow-control-input" type="checkbox" onChange={(e) => {
                                        selectCriteria(data, e)
                                    }} value='' id={data.filterName} />
                                    <span className="overflow-control-indicator"></span>
                                </label>
                                <label className="form-check-label text-5 ml-2" htmlFor={data.id}>{data.filterName}</label>
                            </div>)
                        })
                    }

                </div>
            </div>
        </div>
    )
}

export default FilterComponent
