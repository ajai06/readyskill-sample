import React, { useState } from 'react'

function LearnersAssesment({ assessmentTopics, assessmentData, getAssesmentData }) {

    const pageCount = 4;
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(pageCount);
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = assessmentData.length > 0 ? Math.ceil(assessmentData.length / pageCount) : 1;


    const next = () => {
        //pagination length need to be changed;
        if (currentPage < totalPages) {
            setEndIndex(endIndex + pageCount);
            setStartIndex(startIndex + pageCount);
            setCurrentPage(currentPage + 1)
        }
    }
    const previous = () => {
        if (startIndex > 0) {
            setEndIndex(endIndex - pageCount);
            setStartIndex(startIndex - pageCount);
            setCurrentPage(currentPage - 1)
        }
    }
    return (
        <div>
            <div className="card-body">
                <div className="d-flex skills-head justify-content-center">
                    <div className="dropdown skills-head text-center">
                        {assessmentTopics?.length>0 && 
                         <div className='text-center assessment-subhead'>
                         <select onChange={(event) => getAssesmentData(event.target.value)}
                             className="text-capitalize assessment-head mb-4">
                             {
                                 assessmentTopics.map(topic => (
                                     <option className="assessment-droplist" key={topic.id} value={topic.id}>
                                         {topic.name} Results
                                     </option>
                                 ))
                             }
                         </select>
                     </div>
                     }
                       
                    </div>
                </div>
                {
                    assessmentData.length > 0 ? assessmentData.slice(startIndex, endIndex).map(assessment => (
                        <div className='mb-4' key={assessment.id}>
                            <p className="qstn-text mb-2" >{assessment.question}</p>
                            {
                                assessment.assessmentsAnswer.$values.map((answer, i) => (
                                    <p key={i} className="answer-text mb-1 ml-2">{answer.answer}</p>
                                ))
                            }
                        </div>
                    )) : <div className='noAssesment'>No records found</div>
                }
            </div>
            <div className="card-footer d-flex pagination-footer">
                <span className={startIndex === 0 ? "material-icons filter-arrow-disabled mr-3 mt-1" : "material-icons filter-arrow mr-3 mt-1"} onClick={previous}>
                    arrow_back_ios
                </span>
                <p className="subText text-uppercase mb-1">Page {currentPage} 0f {totalPages}</p>
                <span className={currentPage == totalPages ? "material-icons filter-arrow-disabled mr-3 mt-1" : "material-icons filter-arrow ml-3 mt-1"} onClick={next}>
                    arrow_forward_ios
                </span>
            </div>
        </div>
    )
}

export default LearnersAssesment
