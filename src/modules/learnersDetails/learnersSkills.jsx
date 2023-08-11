import React, { useEffect, useState } from 'react';

import { getLearnerSkills } from '../../services/learnersServices';

function LearnersSkills({ learnerId }) {

    const [allSkillList, setAllSkillList] = useState([]);
    const [filteredSkills, setFilteredSkill] = useState([]);

    const [pageNumber, setPageNumber] = useState(0);
    const [totalPageNumber, setTotalPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const itemPerPage = 4;

    useEffect(() => {
        getLearnerSkills(learnerId)
            .then(res => {
                const total = getNumberOfPages(res.data.$values.length, itemPerPage);
                setTotalPage(total ? total : 1)
                setAllSkillList(res.data.$values);
                setPageNumber(1)
            })
            .catch(err => {
                console.log("error", err.response)
            })
    }, [])

    useEffect(() => {
        const index = ((pageNumber - 1) * itemPerPage)
        const filterted = allSkillList.slice(index, index + itemPerPage);
        setFilteredSkill(filterted);
    }, [pageNumber])

    const getNumberOfPages = (rowCount, rowsPerPage) =>
        Math.ceil(rowCount / rowsPerPage);

    const next = () => {
        if (currentPage < totalPageNumber) {
            setCurrentPage(currentPage + 1);
            setPageNumber(pageNumber + 1);
        }
    }
    const previous = () => {
        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1);
            setPageNumber(pageNumber - 1);
        } else {
            setCurrentPage(1);
        }

    }

    return (
        <div>
            <div className="card-body">
                {
                   filteredSkills.length>0 ? filteredSkills.map(item => (
                        <div key={item.id}>
                            <div  className="d-flex skills-head justify-content-center">
                            </div>

                            <p className="subHead-text text-capitalize mb-2">
                                {item.title}
                            </p>
                            <p className="activity-text mb-5">
                                {item.description}
                            </p>
                        </div>
                    ))
                    : <div className="d-flex skills-head justify-content-center">
                        <p className="subHead-text text-capitalize mb-2">
                                No skills found
                        </p>
                    </div>
                }
            </div>
            <div className="card-footer d-flex pagination-footer">
                <span className={currentPage === 1 ? "material-icons filter-arrow-disabled mr-3 mt-1" : "material-icons filter-arrow mr-3 mt-1"} onClick={previous}>
                    arrow_back_ios
                </span>
                <p className="subText text-uppercase mb-1">Page {currentPage} 0f {totalPageNumber}</p>
                <span className={currentPage === totalPageNumber ? "material-icons filter-arrow-disabled ml-3 mt-1" : "material-icons filter-arrow ml-3 mt-1"} onClick={next}>
                    arrow_forward_ios
                </span>
            </div>
        </div>
    )
}

export default LearnersSkills
