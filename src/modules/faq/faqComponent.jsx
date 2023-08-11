import React from 'react'
import DashboardHeaderComponent from '../../sharedComponents/dashboardHeader/dashboardHeaderComponent'
import './faq.scss';

import { faqs } from '../../utils/constantTexts';



function FaqComponent() {
    return (
        <div id="main-faq">
            <DashboardHeaderComponent headerText="FAQ" />
            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 mb-3 pr-2">
                <div className='card faq-card'>
                    <div className='card-body pt-5'>
                    <div className='text-white faqs'>
                        {
                            faqs.map(faq => (
                                <div key={faq.question}>
                                    <div className='qstn-text'>
                                        {faq.question}
                                    </div>
                                    <br />
                                    <div className='answer-text'>
                                        {faq.answer}
                                    </div>
                                    <hr />
                                </div>
                            ))
                        }
                    </div>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default FaqComponent
