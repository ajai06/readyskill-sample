import React from 'react'

function EducationEnrollment({enrollments,organizations}) {
    const getEducationEnrollmentName = (data) => {
        if (organizations) {
            let org = organizations.find(obj => obj.id === data.institutionId);
            if (org) {
                return `${org.organizationName} ( ${org.city},  ${org.state})`
            } else {
                return ""
            }

        } else {
            return "";
        }
    }
    return (
        <div className="ml-3">
            {/* <p className="inner-head mb-2">EDUCATION ENROLLMENT<span className="learner-sub-count ml-2">{enrollments.length}</span> :</p> */}
            {
               enrollments?.slice(0,2).map(enroll=>(<p key={enroll.id} className="inner-sub text-capitalize mb-1">{getEducationEnrollmentName(enroll)}</p>)) 
            }
        </div>
    )
}

export default EducationEnrollment