import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from "react-router-dom";

import WithLayout from '../../sharedComponents/hoc/withLayOut'
import DashboardHeaderComponent from '../../sharedComponents/dashboardHeader/dashboardHeaderComponent';
import { clearAlert, GuidFormat, OrganizationTypes } from '../../utils/contants';
import {
    getAllUsersForCandidateName,
    getCandidateEnrolledDetails,
    getInformtionTrayCount,
    serviceDashboardUsers
} from '../../services/dashboardServices';
import { UserAuthState } from '../../context/user/userContext';
import { getCandidateCardDetails } from '../../services/dashboardServices';
import { learnersTrayInformation } from '../../services/learnersServices';
import CandidateCardComponent from '../../sharedComponents/candidateCard/candidateCardComponent';
import InformationTrayComponent from '../../sharedComponents/informationTray/informationTrayComponent';
import Breadcrumbs from '../../sharedComponents/BreadCrumbs/breadCrumbs';
import { useIsMounted } from '../../utils/useIsMounted';
import './learners.scss'
import { getOrganizationTypes } from '../../services/organizationServices';
import { getConversationData, getFlaggedLearnersInThread } from '../../services/messageCenterServices';
import { getSocialServiceByOrganization, processUserList } from '../../services/adminServices';
import { AppConfig } from '../../services/config';
import { ConstText } from '../../utils/constantTexts';

function LearnersContainer() {

    const userState = UserAuthState();
    const location = useLocation();
    const [filterParams, setFilterParams] = useState({
        "userIds": [],
        "searchProperty": "",
        "pageNumber": 0,
        "cardCount": 0
    });
    const [candidateList, setCandidateList] = useState([]);
    const [allUserList, setAllUserList] = useState([]);
    const [organizationList, setOrganization] = useState([]);
    const [informationTrayList, setInformationTray] = useState([]);
    const isMounted = useIsMounted();

    //timeout cleanup

    const timeOutIDs = useRef([]);

    useEffect(() => {
        return () => {
            let ids = timeOutIDs.current
            clearAlert(ids);
        };
    }, []);

    useEffect(() => {
        //TRAY counts with multiple APIs
        if (userState.role_GlobalAdmin) {
            trayCountForOrganizations();
        } else if (
            userState.organization_type === OrganizationTypes.KNOWLEDGEPARTNER) {
            getAllUsersForKnowledgeAndEmployerCountChecking();
        } else if (userState.organization_type === OrganizationTypes.SERVICEPARTNER) {
            getSocailServiceWithOrganiazation();
        }
        else {
            getAllUsersForKnowledgeAndEmployerCountChecking();
        }

        //CARDS with multiple APIs
        if (userState.organization_type === OrganizationTypes.SERVICEPARTNER) {
            getSocailServiceDetailsWithOrganiazation();
        } else {
            getAllUsers();
        }


    }, [])


    const trayCountForOrganizations = () => {
        serviceDashboardUsers(AppConfig.mobileOrganizationId)
            .then((res) => {
                if (isMounted()) {
                    let globalAdmin = true;
                    let response = res.data.filter((obj) => !obj.isSuspended);
                    if (userState.role_GlobalAdmin) {
                        getFilteredLearnersData(response, globalAdmin);
                    } else {
                        SponsoredProgramDetails();

                    }

                }
            })
            .catch((err) => {
                console.log(err.response);
            });
    };

    const getSocailServiceWithOrganiazation = () => {
        getSocialServiceByOrganization(userState.user.organization.organizationId)
            .then(res => {
                if (res.data) {
                    if (isMounted()) {
                        let responseData = res.data.socialServiceList.$values;
                        getAllUsersForCountChecking(responseData)
                    }
                }
            })
            .catch(err => {
                console.log(err.response);
            })
    }

    const getSocailServiceDetailsWithOrganiazation = () => {
        getSocialServiceByOrganization(userState.user.organization.organizationId)
            .then(res => {
                if (res.data) {
                    if (isMounted()) {
                        let responseData = res.data.socialServiceList.$values;
                        if (responseData?.length > 0) {
                            getAllUsers(responseData)
                        }
                    }
                }
            })
            .catch(err => {
                console.log(err.response);
            })
    }


    const getAllUsersForCountChecking = (serviceList) => {
        getAllUsersForCandidateName()
            .then(res => {
                if (res.data) {
                    if (isMounted()) {
                        let result = serviceList.filter(obj => {
                            return res.data.some(item => item.id === obj.applicationUserId
                                && !item.isSuspended && item.isActive)
                        })

                        SponsoredProgramDetails(result)
                    }
                }
            })
            .catch(err => {
                console.log(err.response);
            })
    }

    const getAllUsersForKnowledgeAndEmployerCountChecking = () => {
        getAllUsersForCandidateName()
            .then(res => {
                if (res.data) {
                    if (isMounted()) {
                        let result = res.data.filter(item => !item.isSuspended && item.isActive)
                        SponsoredProgramDetails(result)
                    }
                }
            })
            .catch(err => {
                console.log(err.response);
            })
    }

    const getAllUsers = (serviceList) => {
        getAllUsersForCandidateName()
            .then(res => {
                if (res.data) {
                    if (isMounted()) {
                        let response = res.data.filter(obj => obj.isActive && !obj.isSuspended)
                        if (serviceList) {
                            let result = response.filter(obj => {
                                return serviceList.some(item => obj.id === item.applicationUserId)
                            })
                            setAllUserList(result);
                            getCandidateDetails(result);

                        } else {

                            setAllUserList(response);
                            getCandidateDetails(response);
                        }

                    }
                }
            })
    }

    const getCandidateDetails = (users) => {
        getCandidateCardDetails(filterParams)
            .then(res => {
                if (res.data) {
                    if (isMounted()) {
                        if (users) {
                            let responseData = res.data.candidateCardList.$values.filter(obj => {
                                return users.some(item => item.id === obj.applicationUserId && !item.isSuspended && item.isActive)
                            });
                            //setting required fields
                            let candidateObject = responseData.map(candidate => ({
                                ...candidate,
                                carrerSpecialization: "",
                                weeksToComplete: "",
                                graduationDate: "",
                                institutionName: "",
                                learnerName: "",
                                progressPercentage: "",
                                unreadMessageCount: 0,
                                educationStatus: ""

                            }))
                            candidateObject.map(obj => {
                                users.map(data => {
                                    if (obj.applicationUserId === data.id) {
                                        obj.learnerName = data.firstName + " " + data.lastName;
                                        return obj.learnerName;
                                    } else {
                                        return '';
                                    }
                                })
                            })
                            getCandidateEnrolledData(candidateObject);
                        }

                    }
                } else {
                    setCandidateList([]);
                }
            })
            .catch(err => {
                console.log(err.response);
            })
    }

    const getCandidateEnrolledData = (responseData) => {
        getCandidateEnrolledDetails()
            .then(res => {
                if (res) {
                    if (isMounted()) {
                        //setting carrerSpecialization,weeksToComplete,graduationDate
                        let result = [];
                        let candidateList = [];
                        if (!userState.role_GlobalAdmin) {
                            if (userState.organization_type === OrganizationTypes.SERVICEPARTNER) {
                                result = res.data.$values.filter(obj => obj.isSponsoredProgram)
                            } else if (userState.organization_type === OrganizationTypes.KNOWLEDGEPARTNER) {

                                result = res.data.$values.filter(obj => obj.isSponsoredProgram && obj.institutionId === userState.user.organization.organizationId)
                                console.log(result);
                            } else {
                                result = res.data.$values.filter(obj => obj.isSponsoredProgram && obj.sponsoredOrgID === userState.user.organization.organizationId)
                            }
                            candidateList = responseData.filter(item => {
                                return result.some(obj => obj.learnersId === item.applicationUserId)
                            })
                            if (result?.length > 0 && candidateList?.length > 0) {
                                candidateList.map(data => {
                                    if (result.find(obj => obj.learnersId === data.applicationUserId)) {
                                        data.carrerSpecialization = result.find(obj => obj.learnersId === data.applicationUserId).carrerSpecialization;
                                        data.weeksToComplete = result.find(obj => obj.learnersId === data.applicationUserId).weeksToComplete;
                                        data.graduationDate = result.find(obj => obj.learnersId === data.applicationUserId).graduationDate;
                                        data.progressPercentage = (result.find(obj => obj.learnersId === data.applicationUserId).currentWeek / result.find(obj => obj.learnersId === data.applicationUserId).totalWeek) * 100;
                                        data.educationStatus = result.find(obj => obj.learnersId === data.applicationUserId).educationStatus;
                                    }
                                })
                            } else {
                                return;
                            }

                        } else {
                            responseData.map(data => {
                                if (res.data.$values.find(obj => obj.learnersId === data.applicationUserId)) {
                                    data.carrerSpecialization = res.data.$values.find(obj => obj.learnersId === data.applicationUserId).carrerSpecialization;
                                    data.weeksToComplete = res.data.$values.find(obj => obj.learnersId === data.applicationUserId).weeksToComplete;
                                    data.graduationDate = res.data.$values.find(obj => obj.learnersId === data.applicationUserId).graduationDate;
                                    data.progressPercentage = (res.data.$values.find(obj => obj.learnersId === data.applicationUserId).currentWeek / res.data.$values.find(obj => obj.learnersId === data.applicationUserId).totalWeek) * 100;
                                    data.educationStatus = res.data.$values.find(obj => obj.learnersId === data.applicationUserId).educationStatus;
                                }
                            })
                        }

                        getAllInstitutions(candidateList?.length > 0 ? candidateList : responseData, result?.length > 0 ? result : res.data.$values)
                    }
                }
            })
    }

    const getAllInstitutions = async (responseData, enrolledData) => {
        getOrganizationTypes()
            .then(async (res) => {
                if (isMounted()) {
                    const knowledgeData = await res.data.find(item => item.type === OrganizationTypes.KNOWLEDGEPARTNER);
                    const list = knowledgeData.organizationList
                    setOrganization(list);
                    //setting institution name
                    responseData.map(data => {
                        if (enrolledData.find(obj => obj.learnersId === data.applicationUserId)) {
                            let latestEnrolled = enrolledData.find(obj => obj.learnersId === data.applicationUserId)
                            if (latestEnrolled) {
                                if (list.find(inst => inst.id === latestEnrolled.institutionId)) {
                                    return data.institutionName = list.find(inst => inst.id === latestEnrolled.institutionId).organizationName;
                                }
                            }
                        }
                    })
                    getMessageList(responseData)
                }
            })
            .catch(err => {
                console.log(err);
            })
    }


    const getMessageList = (responseData) => {
        getConversationData(userState.user.id)
            .then(res => {
                if (res.data) {
                    if (isMounted()) {
                        let messageData = res.data.$values;
                        if (messageData) {
                            responseData.map(data => {
                                if (messageData.find(obj => obj.secondaryUserId === data.applicationUserId)) {
                                    return data.unreadMessageCount = messageData.find(obj => obj.secondaryUserId === data.applicationUserId).unreadMessageCount;
                                }
                            })
                        }
                    }
                }
                if (location.state?.value && location.state?.criteria) {
                    careerCriteriaFilter(responseData)
                } else {
                    setCandidateList(responseData);
                }
            })
            .catch(err => console.log(err))
    }

    const getFilteredLearnersData = (data, globalAdmin) => {
        let learners = [];
        let sponsored = [];
        let onTargetCount = 0;
        let onTargetEducation = []
        let uniqueTargetList = [];
        let sponsoredUnique = [];
        let unique = [];
        if (data?.length > 0) {
            let params = {
                applicationUserIds: []
            }
            if (data) {
                data.forEach((element) => {
                    params["applicationUserIds"].push(globalAdmin ? element.id : element.learnersId);
                });
            }

            processUserList(params)

                .then(res => {
                    if (res.data) {

                        if (isMounted()) {

                            learners = data?.filter(item => {
                                return res.data.$values.some(obj => obj.applicationUserId ===
                                    (globalAdmin ? item.id : item.learnersId) && obj.reviewRequired)
                            })

                            sponsored = data?.filter(item => {
                                return res.data.$values.some(obj => obj.applicationUserId ===
                                    (globalAdmin ? item.id : item.learnersId))
                            })

                            sponsoredUnique = [...new Set(sponsored?.map(item => globalAdmin ? item.id : item.learnersId))];
                            unique = [...new Set(learners?.map(item => globalAdmin ? item.id : item.learnersId))];

                            onTargetEducation = data?.filter(obj => obj.educationStatus === ConstText.EDUCATIONSTATUS)
                            uniqueTargetList = [...new Set(onTargetEducation?.map(item => globalAdmin ? item.id : item.learnersId))];
                            onTargetCount = uniqueTargetList?.length;
                        }

                    }

                    getAllLearners(unique, sponsoredUnique, onTargetCount);
                })
        } else {
            getAllLearners(unique, sponsoredUnique, onTargetCount);
        }
    }

    const getAllLearners = (data, sponsoredUnique, onTargetCount) => {
        serviceDashboardUsers(AppConfig.mobileOrganizationId)
            .then(res => {
                if (isMounted()) {
                    let count = 0;
                    let sponsoredCount = 0;
                    res.data.map(obj => {
                        data.map(item => {
                            if ((obj.id === item)) {
                                return count = count + 1;
                            }
                        })
                    })
                    res.data.map(obj => {
                        sponsoredUnique.map(item => {
                            if ((obj.id === item)) {
                                return sponsoredCount = sponsoredCount + 1;
                            }
                        })
                    })
                    if (userState.organization_type === OrganizationTypes.SERVICEPARTNER ||
                        userState.organization_type === OrganizationTypes.KNOWLEDGEPARTNER ||
                        userState.organization_type === OrganizationTypes.EMPLOYERPARTNER
                    ) {
                        getInformationTrayDetailsService(count, sponsoredCount, onTargetCount)
                    } else {

                        getInformationTrayDetails(count);
                    }

                }
            })
            .catch(err => {
                console.log(err.response);
            })
    }


    const getInformationTrayDetailsService = async (flaggedcount, sponsoredCount, ontargetcount) => {
        try {
            let params = {};
            params = {
                userType: "Social Service",
                page: "Learners"
            }
            let response = await learnersTrayInformation(params)
            let responseData = (
                userState.organization_type === OrganizationTypes.SERVICEPARTNER ||
                userState.organization_type === OrganizationTypes.KNOWLEDGEPARTNER ||
                userState.role_GlobalAdmin) ? await response.data.$values
                : await response.data.$values.filter(obj => obj.headingText !== "FLAGGED LEARNERS");


            const newArr = await Promise.all(responseData.map(async item => {
                try {
                    if (item.headingText === "SPONSORED LEARNERS") {
                        item.count = sponsoredCount;
                    } else if (item.headingText === "ON TARGET PROGRESS") {
                        item.count = ontargetcount;
                    }
                    else if (item.headingText === "FLAGGED LEARNERS") {
                        item.count = flaggedcount;
                    } else {
                        item.count = 0;
                    }
                    return item;
                } catch (error) {
                    console.log(error)
                }
            }));

            setInformationTray(newArr);

        } catch (error) {
            console.log(error);
        }

    };


    const getInformationTrayDetails = async (flaggedCount) => {
        try {
            let params = {};
            if (userState.organization_type === OrganizationTypes.SERVICEPARTNER || userState.role_GlobalAdmin) {
                params = {
                    userType: "Social Service",
                    page: "Learners"
                }
            } else if (userState.organization_type === OrganizationTypes.EMPLOYERPARTNER) {
                params = {
                    userType: "employer",
                    page: "student"
                }
            } else if (userState.organization_type === OrganizationTypes.KNOWLEDGEPARTNER) {
                params = {
                    userType: "Knowledge",
                    page: "Learners"
                }
            } else {
                params = {
                    userType: "employer",
                    page: "student"
                }
            }
            let response = await learnersTrayInformation(params)
            let responseData = (
                userState.organization_type === OrganizationTypes.SERVICEPARTNER ||
                userState.organization_type === OrganizationTypes.KNOWLEDGEPARTNER ||
                userState.role_GlobalAdmin) ?
                await response.data.$values
                : await response.data.$values.filter(obj => obj.headingText !== "FLAGGED LEARNERS");

            const newArr = await Promise.all(responseData.map(async item => {
                try {
                    if (item.apiEndPoint?.length > 0 && item.apiEndPoint !== "/get-flagged-learners-count/") {
                        let res = await getInformtionTrayCount(item.apiEndPoint, userState.role_GlobalAdmin ?
                            GuidFormat.EMPTYLEARNINGMODELID : userState.user.organization.organizationId);
                        item.count = res.data.count;
                    } else if (item.apiEndPoint?.length > 0 && item.apiEndPoint === "/get-flagged-learners-count/") {
                        item.count = flaggedCount;
                    } else {
                        item.count = 0;
                    }
                    return item;
                } catch (error) {
                    console.log(error)
                }
            }));
            setInformationTray(newArr);
        }
        catch (error) {
            console.log(error);
        }

    };


    const careerCriteriaFilter = (candidateData) => {
        if (location.state.value === 1) {
            setCandidateList(candidateData.filter(obj =>
                obj.carrerSpecialization.toLowerCase() === location.state.criteria.toLowerCase()
            ))
        } else if (location.state.value === 2) {
            setCandidateList(candidateData.filter(obj =>
                obj.institutionName.toLowerCase() === location.state.criteria.toLowerCase()
            ))

        } else if (location.state.value === 3) {

        }
        else if (location.state.value === 4) {
            setCandidateList(candidateData.filter(obj =>
                obj.graduationDate.toLowerCase() === location.state.criteria.toLowerCase()
            ))
        }
    }

    const SponsoredProgramDetails = (response) => {
        getCandidateEnrolledDetails()
            .then(res => {
                if (res?.data?.$values) {
                    let result = [];
                    if (!userState.role_GlobalAdmin) {

                        if (userState.organization_type === OrganizationTypes.SERVICEPARTNER && response?.length > 0) {
                            result = res.data.$values.filter(obj => {
                                return response.some(item => item.applicationUserId === obj.learnersId && obj.isSponsoredProgram && obj.isActive)
                            })
                        } else if (userState.organization_type === OrganizationTypes.KNOWLEDGEPARTNER && response?.length > 0) {
                            result = res.data.$values.filter(obj => {
                                return response.some(item => item.id === obj.learnersId && obj.isSponsoredProgram &&
                                    obj.institutionId === userState.user.organization.organizationId)
                            })

                            // result = res.data.$values.filter(obj => obj.isSponsoredProgram &&
                            //     obj.institutionId === userState.user.organization.organizationId && obj.isActive)
                        } else if (userState.organization_type === OrganizationTypes.EMPLOYERPARTNER && response?.length > 0) {
                            result = res.data.$values.filter(obj => {
                                return response.some(item => item.id === obj.learnersId && obj.isSponsoredProgram &&
                                    obj.sponsoredOrgID === userState.user.organization.organizationId)
                            })
                        }
                        // else {
                        //     result = res.data.$values.filter(obj => obj.isSponsoredProgram && obj.isActive)
                        // }

                    } else {
                        result = res.data.$values.filter(obj => obj.isActive)
                    }
                    getFilteredLearnersData(result, false);
                }
            })
    }
    return (
        <div id="main">
            <DashboardHeaderComponent headerText="Learners" />
            <Breadcrumbs />
            <InformationTrayComponent trayInformation={informationTrayList} />
            <div className="container-fluid">
                {
                    userState.cardEnabled &&
                    <div className="mr-15p">
                        <div className="learners-head mb-3 mt-5">
                            <div className="h5 headText">Sponsored Learners</div>
                            <button className="recruit-btn opacity-50">+ Recruit Learners</button>
                        </div>
                        {candidateList.length === 0 && <span className="no-results-card text-white">No results found!</span>}
                        <div className={location.pathname === "/portal/recruiting" ? 'row overflow-class' : 'row'}>
                            {
                                candidateList?.length > 0 && candidateList.map((candidate, i) => (
                                    <CandidateCardComponent
                                        key={i}
                                        {...candidate}
                                        cardColumns="col-4"
                                    />
                                ))
                            }
                        </div>

                    </div>
                }

            </div>
        </div>
    )
}

export default WithLayout(LearnersContainer);
