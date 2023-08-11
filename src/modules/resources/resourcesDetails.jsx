import React from 'react'
import WithLayout from '../../sharedComponents/hoc/withLayOut'
import './resources.scss';
import DashboardHeaderComponent from '../../sharedComponents/dashboardHeader/dashboardHeaderComponent';
import Breadcrumbs from '../../sharedComponents/BreadCrumbs/breadCrumbs'
function ResourcesDetails() {
    return (
        
        
            <div className="programs-main pb-5">
        <div className="program-top">
            <div className="pl-200">
                <DashboardHeaderComponent headerText="Programs"/>
                <Breadcrumbs/>
           </div>
            {/* .......programs detail starts......... */}
           <div className="programs-detailed-container pl-3">
               <div className="pl-200">
                <div className="mt-5 mb-3">
                        <h1 className="h5 role-head mt-3">Data Analyst</h1>
                        <p className="text-5 mb-5">Use python, SQL to cover insight communction critical findings</p>
                </div>
               </div>
                <div className="d-flex w-75 program-trays ml-200">
                    <button className="resources-mg-btn mr-3">CUSTOMIZE SYLLABUS</button>
                    <button className="black-btn mr-3">READYSKILL PARTNER</button>
                    <button className="website-btn mr-3">WEBSITE</button>
                    <button className="refer-btn mr-3">REFER STUDENTS</button>
                </div>
                </div>
           
            {/* .......programs detail ends......... */}
        </div>
             <div className="programs-details ml-200 w-75 pl-3">    
                <p className="programs-smallText text-uppercase mt-90">resource information</p>  
               <div className="row">
                <div className="col-6">
                <h1 className="h5 role-head-black mt-3">Instructions</h1>
                <p className="text-5-black mb-5">Sign up is available online starting around 10 am the previous
                    Friday. Patients should sign up online and then arrive at the clinic on
                    Thursday evening for their scheduled appointment time (5:30 pm,
                    6:30 pm or 7:30 pm). Patients will be seen in the order of sign up
                    and the number of patients seen depends on the number of
                    physicians available. There are 2 walk-in spots for each
                    appointment window as well.</p>
                    <h1 className="h5 role-head-black mt-3">Qualifications & Eligibility</h1>
                <p className="text-5-black mb-5">Franklin County Residents
                Households at or below 200% of the Federal Poverty Level are eligible.</p>
                    <h1 className="h5 role-head-black mt-3">Documents</h1>
                <p className="text-5-black mb-5">Photo ID for adult household member and piece of mail in their
                name dated within the last 90 days.</p>
                </div>
                <div className="col-6">
                <h1 className="h5 role-head-black mt-3">Services</h1>
                <p className="text-5-black mb-5">Blood Pressure Screening
                    Community Clinics<br></br>
                    Diabetes Management Clinics<br></br>
                    Diabetes Screening<br></br>
                    Obstetrics/gynecology<br></br>
                    Pap Tests<br></br>
                    Pharmacies</p>
                    <h1 className="h5 role-head-black mt-3">Hours</h1>
                <p className="text-5-black mb-5">Clinic is held on Thursdays.<br></br>
                Clinic closes at 10 pm.</p>
                <p className='programs-text-1'>Patient check-in times:</p>
                <p className="text-5-black mb-5">5:30 pm, 6:30 pm and 7:30 pm.</p>
                    <h1 className="h5 role-head-black mt-3">Fees & Languages</h1>
                <p className="text-5-black mb-5">No Fees<br></br>
                    Spanish services available as
                    arranged</p>
                </div>
               </div>
            </div>
            <div className='contact-details-section'>
                <div className="ml-200 w-75 pl-3">
                <div className='row'>
                    <div className='col-6'>
                        <div>
                            <p className='role-head'>General Contact</p>
                            <div className='d-flex'>
                            <span className="material-icons refresh-icon mr-2">replay_circle_filled</span>
                            <p className='list-text'>1233 W,Avenue,Ohio</p>
                            </div>
                            <div className='d-flex'>
                            <span className="material-icons refresh-icon mr-2">replay_circle_filled</span>
                            <p className='list-text'><span className="font-weight-bold"><u>Today</u></span> : 9:00 am - 6:00 pm | <span className="font-weight-bold">Open Now</span></p>
                            </div>
                            <div className='d-flex'>
                            <span className="material-icons refresh-icon mr-2">replay_circle_filled</span>
                            <a href='' className='list-text'><u>www.colombouniversity.com</u></a>
                            </div>
                            <div className='d-flex mt-3'>
                            <span className="material-icons refresh-icon mr-2">replay_circle_filled</span>
                            <p className='list-text'>(614) 567 7657</p>
                            </div>
                            <div className='d-flex'>
                            <span className="material-icons refresh-icon mr-2">replay_circle_filled</span>
                            <p className='list-text'>info@email.com</p>
                             </div>
                        </div>
                        <div>
                            <p className='role-head mt-5'>ReadySkill Parnter Contact</p>
                            <p className='list-text'><span className="font-weight-bold">Ann jakobson</span></p>
                            <div className='d-flex mt-3'>
                            <span className="material-icons refresh-icon mr-2">replay_circle_filled</span>
                            <p className='list-text'>(614) 567 7657</p>
                            </div>
                            <div className='d-flex'>
                            <span className="material-icons refresh-icon mr-2">replay_circle_filled</span>
                            <p className='list-text'>info@email.com</p>
                              </div>
                        
                        </div>
                        <div>
                            <p className='role-head mt-5'>Directions</p>
                            <p className='list-text'>Parking behind building</p>
                        </div>
                        
                        </div>
                    </div>
                
                </div>
            </div>
            </div>
     
        
    )
}

export default WithLayout(ResourcesDetails) 
