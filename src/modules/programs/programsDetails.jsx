import React from 'react'
import DashboardHeaderComponent from '../../sharedComponents/dashboardHeader/dashboardHeaderComponent';
import Breadcrumbs from '../../sharedComponents/BreadCrumbs/breadCrumbs'; 
import WithLayout from '../../sharedComponents/hoc/withLayOut';
import sampleImg from "../../assets/img/sampleImg.jpg";
import './programs.scss';


function ProgramsDetails() {
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
                <div className="col-3 pl-0">
                    <div className="card program-tray-card">

                    </div>
                </div>
                <div className="col-3 pl-0">
                    <div className="card program-tray-card">
                    </div>
                </div>
                <div className="col-3 pl-0">
                    <div className="card program-tray-card">
                    </div> 
                </div>
                <div className="col-3 pl-0">
                    <div className="card program-tray-card">
                    </div> 
                </div>
            </div>
            </div>
           
            {/* .......programs detail ends......... */}
        </div>
             <div className="programs-details ml-200 w-50 pl-3">  
                <p className="programs-smallText text-uppercase mt-90">what you'll learn</p>  
                <h1 className="h5 role-head-black mt-3">Data Analyst with Python</h1>
                <p className="text-5-black mb-5">Use python, SQL to cover insight communction critical findings cover
                 insight communction critical python, SQL to cover insight communction SQL to cover insight communction critical findings cover
                 insight communction critical python</p>
            </div>
            <div className="pl-3">
            <div className="card program-inner w-75 ml-200 pl-3">
                <div className="card-body pb-5">
                    <div className="d-flex">
                        <h1 className="h5 role-head mt-3">Course Syllabus</h1>
                        <button className="costumize-btn">CUSTOMIZE SYLLABUS</button>
                        <button className="sponsor-btn">SPONSOR THIS PROGRAM</button>
                    </div>
                    <div className="list-wrapper mt-5">

                        <div className="vertical-line"></div>
                        
                        <div className="list-item-wrapper mt-5">
                            <div className="list-bullet"></div>
                            <div className="list-item">
                                <div className="text-6">Introduction to Data analysis</div>
                                <div className="list-text w-75 mb-2">The parallels with the alcoholic republic of two hundred years ago are 
                                hard to miss. Before the changes in lifestyle, before the clever marketing, comes the mountain of cheap corn. </div>
                                <div className="d-flex mt-1">
                                <span className="material-icons program-icon">sms</span>
                                <p className="subText text-uppercase">explore weather trends</p>
                                </div>
                                <div className="d-flex mt-1">
                                <span className="material-icons program-icon">sms</span>
                                <p className="subText text-uppercase">explore weather trends</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="list-item-wrapper mt-5">
                            <div className="list-bullet"></div>
                            <div className="list-item">
                                <div className="text-6">This is an item</div>
                                <div className="list-text w-75">But the outcome of our national drinking binge is not nearly as relevant to 
                                our own situation as its underlying cause. Which, put simply, was this: American farmers were producing far too much corn. </div>
                                <div className="d-flex mt-1">
                                <span className="material-icons program-icon">sms</span>
                                <p className="subText text-uppercase">explore weather trends</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="list-item-wrapper mt-5">
                            <div className="list-bullet"></div>
                            <div className="list-item">
                                <div className="text-6">This is the bottom item</div>
                                <div className="list-text w-75">In the early years of the nineteenth century, Americans began drinking 
                                more than they ever had before or since, embarking on a public health crisis -- the obesity epidemic of its day. </div>
                                <div className="d-flex mt-1">
                                <span className="material-icons program-icon">sms</span>
                                <p className="subText text-uppercase">explore weather trends</p>
                                </div>
                            </div>
                            <div className="white-line"></div>
                        </div>
    
                </div>
                </div>      
            </div>
            </div>
            <div className="programs-details ml-200 pl-3 w-75">  
                <p className="programs-smallText text-uppercase mt-5">This program includes</p> 
                <div className="container-fluid p-0">
                <div className="row">
                
                    <div className="col-6 p-0 d-flex pb-4">
                        <div className="col-5">
                            <img
                            src={sampleImg}
                            className="mt-2 w-100"
                            alt="Profile"
                            height="160"
                            />
                        </div>
                        <div className="col-7 p-0">
                            <p className="programs-text-1 text-capitalize mt-2">Real World projects from industry experts</p>
                            <p className="programs-subText">Use python, SQL to cover insight communction critical findings cover
                            insight communction critical python,</p>
                        </div>
                    </div>
                    <div className="col-6 p-0 d-flex pb-4">
                        <div className="col-5">
                            <img
                            src={sampleImg}
                            className="mt-2 w-100"
                            alt="Profile"
                            height="160"
                            />
                        </div>
                        <div className="col-7 p-0">
                            <p className="programs-text-1 text-capitalize mt-2">Real World projects from industry experts</p>
                            <p className="programs-subText">Use python, SQL to cover insight communction critical findings cover
                            insight communction critical python,</p>
                        </div>
                    </div>
                    <div className="col-6 p-0 d-flex pb-4">
                        <div className="col-5">
                            <img
                            src={sampleImg}
                            className="mt-2 w-100"
                            alt="Profile"
                            height="160"
                            />
                        </div>
                        <div className="col-7 p-0">
                            <p className="programs-text-1 text-capitalize mt-2">Real World projects from industry experts</p>
                            <p className="programs-subText">Use python, SQL to cover insight communction critical findings cover
                            insight communction critical python,</p>
                        </div>
                    </div>
                    <div className="col-6 p-0 d-flex pb-4">
                        <div className="col-5">
                            <img
                            src={sampleImg}
                            className="mt-2 w-100"
                            alt="Profile"
                            height="160"
                            />
                        </div>
                        <div className="col-7 p-0">
                            <p className="programs-text-1 text-capitalize mt-2">Real World projects from industry experts</p>
                            <p className="programs-subText">Use python, SQL to cover insight communction critical findings cover
                            insight communction critical python,</p>
                        </div>
                   
                </div> 
                </div>
                </div>
                <div className="programs-details w-75">   
                <h1 className="h5 role-head-black mt-5">Program Details</h1>
                <p className="programs-text-1 text-uppercase mt-4 mb-1">why should i enroll?</p>
                <p className="text-5-black mb-5">The Data Analyst Nanodegree program offers you the opportunity to master data skills
                    that are in demand by top employers, such as Python and statistics. By the end of the
                    program, you will have created a portfolio of work demonstrating your ability to solve
                    complex data problems. After graduating, you will have the skills needed to join a large
                    corporation or a small firm, or even go independent as a freelance data analyst.
                    You'll have personalized support as you master in-demand skills that qualify you for
                    high-value jobs in the data field.</p>
                <p className="programs-text-1 text-uppercase mt-4 mb-1">WHAT JOBS WILL THIS PROGRAM PREPARE ME FOR?</p>
                <p className="text-5-black mb-5">Graduates will be well prepared to fill a wide array of data related
                    Data Analyst, Analytics Consultant, Product Manager, and Manage</p>
                <p className="programs-text-1 text-uppercase mt-4 mb-1">HOW DO I KNOW IF THIS PROGRAM IS RIGHT FOR ME?</p>
                <p className="text-5-black mb-5">If you're someone who wants to make data driven decisions or wo
                    of data to conduct analyses, or is interested in becoming an data
                    is ideal for you, because you'll learn applied statistics, data </p>
                    
            </div>
            <div className="programs-details w-75">   
                <h1 className="h5 role-head-black mt-5">Statistics about Data Analytics Careers</h1>
                <div className="container mt-4 p-0">
                    <div className="row">        
                            <div className="col-6">
                             <div className="card program-stats pr-3">
                             </div>
                            </div>
                            <div className="col-6">
                             <div className="card program-stats pr-3">
                             </div>
                            </div>
                    </div>                    
                </div>        
            </div>
            <div className="load-more mt-4"><a href="">LOAD MORE</a></div>
            </div>
        </div>
      
    )
}

export default WithLayout(ProgramsDetails) 
