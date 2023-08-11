import React, { useEffect } from 'react'

function AssessmentSettings({ register, errors, editData, checkedGroups, setCheckedGroups, groupList, reminderOptions, computationList, redirectionList, AssessmentTypeList }) {
    useEffect(() => {
        if (editData) {
            const old = editData.assessmentGroupMapping.$values;
            setCheckedGroups(old)
        }
    }, [editData])

    const handleChange = (e) => {

        const value = e.target.value;
        let groups;
        if (e.target.checked) {
            groups = [...checkedGroups, { groupId: e.target.value, isActive: e.target.checked }];
            setCheckedGroups(groups);
        } else {
            groups = checkedGroups.filter((item) => item.groupId !== value);
            setCheckedGroups(groups);
        }
    }

    const getChecked = (item) => {
        if (checkedGroups.length > 0) {
            const checked = checkedGroups.some(i => i.groupId === item.id && i.isActive === true);
            return checked;
        } else {
            return false;
        }
    };


    return (
        <>
            <div className="container-fluid settings-container py-2">
                <div className="row">
                    <div className="col-6 mt-5">
                        <p className="subHead-text-learner mb-4 text-uppercase">
                            Display to the following groups
                        </p>
                        <div className="card-body w-75 px-0 pt-0 assessment-group-list">
                            {
                                groupList.map((item, index) => (
                                    <div key={item.id} className="d-flex">
                                        <div className="px-0 py-1">
                                            <div className="form-check filter-checkboxes ml-3">
                                                <label className="custom-control overflow-checkbox ">
                                                    <input className="form-check-input career-checkbox overflow-control-input"
                                                        type="checkbox"
                                                        key={item.id}
                                                        onChange={(e) => handleChange(e)}
                                                        checked={getChecked(item)}
                                                        value={item.id}
                                                    />
                                                    <span className="overflow-control-indicator"></span>
                                                </label>
                                                <label className="form-check-label text-5"></label>
                                            </div>
                                        </div>
                                        <div className="px-0 py-1">
                                            <p className="inner-sub text-capitalize pl-2 mb-2">
                                                {item.groupName}
                                            </p>
                                        </div>
                                    </div>

                                ))
                            }

                        </div>
                    </div>
                    <div className="col-6">
                        <p className="subHead-text-learner mb-4 text-uppercase mt-5">
                            REMINDERS
                        </p>
                        {
                            reminderOptions && reminderOptions.map(item => (
                                <div key={item.id}>
                                    <input className='custom-radio' {...register("reminderId")} id={item.id} value={item.id} type="radio" name='reminderId' />
                                    <label className="radio" htmlFor={item.id} >{item.reminderOption}</label>
                                </div>
                            ))
                        }

                        <p className="subHead-text-learner mb-4 text-uppercase mt-5">
                            Results Computation Module
                        </p>
                        <div className="text-center assessment-drop mt-1 w-50">
                            <select {...register("resultComputationId")} defaultValue="" name="resultComputationId" className="text-capitalize select-case caseworker-select mb-1 w-100">
                                <option
                                    className="caseworker-droplist text-capitalize w-100"
                                    value=""
                                    disabled
                                >
                                    please Select
                                </option>
                                {
                                    computationList && computationList.map(item => (
                                        <option value={item.id} key={item.id} className="caseworker-droplist text-capitalize w-100">{item.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <p className="subHead-text-learner mb-4 text-uppercase mt-5">
                            Assessment Type
                        </p>
                        <div className="text-center assessment-drop mt-1 w-50">
                            <select {...register("typeId")} defaultValue="" name="typeId" className="text-capitalize select-case caseworker-select mb-1 w-100">
                                <option
                                    className="caseworker-droplist text-capitalize w-100"
                                    value=""
                                    disabled
                                >
                                    please Select
                                </option>
                                {
                                    AssessmentTypeList && AssessmentTypeList.map(item => (
                                        <option value={item.id} key={item.id} className="caseworker-droplist text-capitalize w-100">{item.name}</option>
                                    ))
                                }
                            </select>

                        </div>
                        <span className="error-msg">{errors.typeId?.message}</span>
                        <p className="subHead-text-learner mb-4 text-uppercase mt-5">
                            Post Assessment
                        </p>

                        <div className="d-flex mb-3">
                            <div className="px-0 py-1">
                                <div className="form-check filter-checkboxes">
                                    <label className="custom-control overflow-checkbox">
                                        <input
                                            className="form-check-input career-checkbox overflow-control-input"
                                            type="checkbox" {...register("showThankYouPage")}
                                        /><label className="form-check-label subText pl-2"> Show thank-you</label>
                                        <span className="overflow-control-indicator"></span>
                                    </label>

                                </div>
                            </div>
                            {/* <div className="px-0 py-1">
                                <p className="subText d-grid pl-2 mb-4">
                                    Show thank-you
                                </p>
                            </div> */}
                        </div>

                        {
                            redirectionList && redirectionList.map(item => (
                                <div key={item.id}>
                                    <input className='custom-radio' type="radio" {...register("redirectPageId")} value={item.id} id={item.id} name="redirectPageId" />
                                    <label className="radio" htmlFor={item.id}>
                                        {item.name}
                                    </label>
                                </div>
                            ))
                        }



                    </div>
                </div>
            </div>
        </>
    )
}

export default AssessmentSettings