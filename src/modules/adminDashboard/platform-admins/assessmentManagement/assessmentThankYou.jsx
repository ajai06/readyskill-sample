import React from 'react'

function AssessmentThankYou({register}) {
    return (
        <>
            <div className="container-fluid py-2 thankYou-container">
                <div className="row">
                    <div className='col-5'>
                    <p className="subHead-text-learner mb-2 mt-3 text-uppercase">
                    instructions
                    </p>
                    <p className="subText">The Thank You Page is the last page a learner will see when finishing your assessment. This page will show when the option to
                        display a thank you page is selected. The user will see a continue button which will navigate them to the selected page.</p>
                    </div>

                    <div className='col-7'>

                    <p className="subHead-text-learner mb-2 mt-3 text-uppercase">
                    Thank you message
                    </p>
                    <textarea {...register("thankYouDescription")} className="form-control mt-2 mb-4" rows="3" placeholder="Provide a short thank you to the user reinforcing the reason for the assessment and how the answers will be helpful."></textarea>
                    <p className="subHead-text-learner mb-2 mt-3 text-uppercase">
                    Additional Instructions
                    </p>
                    <textarea {...register("additionalInstructions")} className="form-control mt-3" rows="5" placeholder="Provide additional instructions (optional)."></textarea>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AssessmentThankYou