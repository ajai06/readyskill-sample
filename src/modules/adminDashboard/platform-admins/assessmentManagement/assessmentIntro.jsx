import React from 'react'

function AssessmentIntro({register}) {
    return (
        <>
            <div className="container-fluid py-2 intro-container">
                <div className="row">
                    <div className='col-5'>
                    <p className="subHead-text-learner mb-2 mt-3 text-uppercase">
                    instructions
                    </p>
                    <p className="subText">The Introduction Page is the first page a learner will see when starting this assessment. 
                    The learner will automatically see the title of the assessment, a progress bar, and a message welcoming them to the assessment , 
                    which will includes their first name. You must provide a short intro-pitch and a description or instructions</p>
                    </div>

                    <div className='col-7'>

                    <p className="subHead-text-learner mb-2 mt-3 text-uppercase">
                    Intro Pitch
                    </p>
                    <textarea {...register("shortDescription")} className="form-control mt-2 mb-4" rows="3" placeholder="Provide a short intro pitch inviting the learner to take the assessment."></textarea>
                    <p className="subHead-text-learner mb-2 mt-3 text-uppercase">
                    Details or Instructions
                    </p>
                    <textarea {...register("longDescription")} className="form-control mt-3" rows="5" placeholder='Provide a description of what the assessment is, what the goal of the assessment is, and any instructions the user may need to be able to successfully complete the assessment.'></textarea>

                    </div>

                </div>
            </div>
        </>
    )
}

export default AssessmentIntro