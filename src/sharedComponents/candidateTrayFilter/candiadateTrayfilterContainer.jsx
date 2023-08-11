import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

import CategoryComponent from './categoryComponent';
import SubCategoryComponent from '../candidateTrayFilter/subCategoryComponent';
import LeafNodeComponent from './leafNodeComponent';
import FilterComponent from './filterComponent';
import CandidateCardComponent from '../candidateCard/candidateCardComponent';
import {
    getCandidateTrayFilter,
    getCandidateCardDetails,
    getAllUsersForCandidateName,
    getCandidateEnrolledDetails
} from "../../services/dashboardServices";
import { UserAuthState } from '../../context/user/userContext';
import '../candidateTrayFilter/candidatetray.scss';
import { useIsMounted } from '../../utils/useIsMounted';
import { getOrganizationTypes } from '../../services/organizationServices';
import { OrganizationTypes, GuidFormat, Gender, clearAlert } from '../../utils/contants';
import { getConversationData } from '../../services/messageCenterServices'

function CandiadateTrayfilterContainer() {

    const userState = UserAuthState();
    const navigate = useNavigate();
    const location = useLocation();
    //navigation flags
    const [isCategory, setHideCategory] = useState(true);
    const [isSubcategory, setHideSubcategory] = useState(true);
    const [isLeafCategory, setHideLeafCategory] = useState(false);
    const [isFilter, setHideFilter] = useState(false);
    const [categoryList, setCategoryList] = useState([]);
    const [subCategoryList, setSubcategoryList] = useState([]);
    const [filteredSubcategory, setFilteredSubcategory] = useState([]);
    const [leafCategoryList, setLeafCategoryList] = useState([]);
    const [filterCriteriaList, setFilterCriteriaList] = useState([]);
    const [filterParams, setFilterParams] = useState({
        "userIds": [],
        "searchProperty": "",
        "pageNumber": 0,
        "cardCount": location.pathname === '/portal/dashboard' ? 0 : 0,
        "filterValues": [[GuidFormat.EMPTYGUID]]
    });
    const isMounted = useIsMounted();


    const timeOutIDs = useRef([]);

    useEffect(() => {
        return () => {
            let ids = timeOutIDs.current
            clearAlert(ids);
        };
    }, []);

    //candidate card
    const [candidateList, setCandidateList] = useState([]);
    const [candidateListFilter, setCandidateListFilter] = useState([]);
    const [header, setHeader] = useState('');
    const [subHeader, setSubHeader] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCardCount, setTotalCardCount] = useState(0);
    const [searchInput, setSearchInput] = useState("");
    const [allUserList, setAllUserList] = useState([]);
    const [organizationList, setOrganization] = useState([]);
    const [startIndex, setStartIndex] = useState(0)
    const [endIndex, setEndIndex] = useState(4);
    const [filterArray, setFilterArray] = useState([]);
    const cardCount = 4;
    const [filteredList, setFilterList] = useState([]);
    const [filterHeader, setFilterHeader] = useState("");
    const [allCategory, setAllCategory] = useState([]);
    const [allLeafNodes, setAllLeafNodes] = useState([]);

    const getTrayFilterData = () => {
        let guid = '3FA85F64-5717-4562-B3FC-2C963F66AFA6';
        getCandidateTrayFilter(guid)
            .then((res) => {
                if (res.data) {
                    if (isMounted()) {
                        getCategories(res.data);
                        getSubCategoryData(res.data);
                        setAllCategory(res.data)
                        getLeafNodes(res.data)
                    }
                } else {
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const getLeafNodes = (data) => {
        let categoryData = [];
        data.$values.map(obj => {
            obj.$values.map(res => {
                if ((res.mainParent === obj.$values[0].mainParent) && res.leafNode && res.filterLevel !== 0) {
                    categoryData.push(res);
                }
            })
        });
        setAllLeafNodes(categoryData);
    }

    const getCategories = (responseData) => {
        let categoryData = [];
        responseData.$values.map(obj => {
            obj.$values.map(res => {
                if (res.parent === GuidFormat.EMPTYGUID) {
                    categoryData.push(res);
                }
            })
        });
        setCategoryList(categoryData);
    }

    const getSubCategoryData = (responseData) => {
        let subCategory = [];
        responseData.$values.map(obj => {
            obj.$values.map(res => {
                if (res.parent !== GuidFormat.EMPTYGUID) {
                    subCategory.push(res);
                }
            })
        });
        setSubcategoryList(subCategory);
    }
    const onSelectCategory = (returnFlag, selectedCategory) => {
        if (selectedCategory) {
            //below checking need to be removed once we get actual data
            if ((selectedCategory.id !== "05550524-2ec6-4ac4-8f3a-4e3f45d58e6f" && selectedCategory.id !== "d99ffd91-f77e-4cff-bd31-33ab88ac0b76")) {
                return;
            }

            if (selectedCategory.leafNode) {
                let filteredData = []
                let mainHeadText = '';
                filteredData = subCategoryList.filter(data => data.parent === selectedCategory.id);
                mainHeadText = subCategoryList.filter(data => data.parent === selectedCategory.id)[0].mainHeadText;
                setFilteredSubcategory(filteredData);
                setHeader(mainHeadText);
                setHideCategory(returnFlag);
            } else {
                let filterCriteria = []
                filterCriteria = subCategoryList.filter(data => data.parent === selectedCategory.id);
                setFilterCriteriaList(filterCriteria);
                setHideFilter(true);
                setHideCategory(true);
                setHideSubcategory(false);
                setHideLeafCategory(true)
            }
        } else {
            setHideCategory(returnFlag);
        }

    }
    const onSelectSubcategory = (returnFlag, selectedSubcategory) => {
        if (selectedSubcategory) {
            //below checking need to be removed once we get actual data
            if (selectedSubcategory.id !== "74fd1382-f70c-431a-b1b7-11b3b67ae92e") {
                return;
            }

            let filteredSubcategory = [];
            let mainHeadText = '';
            let subHeadText = '';
            filteredSubcategory = subCategoryList.filter(data => data.parent === selectedSubcategory.id);
            mainHeadText = subCategoryList.filter(data => data.parent === selectedSubcategory.id)[0].mainHeadText;
            subHeadText = subCategoryList.filter(data => data.parent === selectedSubcategory.id)[0].subHeadText;
            setLeafCategoryList(filteredSubcategory);
            setHeader(mainHeadText);
            setSubHeader(subHeadText);
            setHideCategory(true);
            setHideSubcategory(returnFlag);
            setHideLeafCategory(true)
        } else {
            setHideCategory(true);
            setHideSubcategory(returnFlag);
        }

    }
    const onSelectLeafCategory = (returnFlag, selectedLeafData) => {
        if (selectedLeafData) {
            //below checking need to be removed once we get actual data
            if (selectedLeafData.id !== "11c66c4c-f188-4e8b-8cc4-4afddc0c098b") {
                return;
            }
            let filterCriteria = []
            filterCriteria = subCategoryList.filter(data => data.parent === selectedLeafData.id);
            setFilterCriteriaList(filterCriteria);
            setHideFilter(returnFlag);
            setHideCategory(true);
            setHideSubcategory(false);
            setHideLeafCategory(true);

        } else {
            setHideCategory(false);
            setHideSubcategory(true);
            setHideLeafCategory(returnFlag)
        }
    }

    const backFromFilter = (returnFlag, filterLevel) => {
        if (filterLevel) {
            //if filter level is 1 then we can move directly to filter category page 
            setHideCategory(true);
            setHideSubcategory(true);
            setHideFilter(false);
            setHideLeafCategory(false);
        } else {
            setHideFilter(returnFlag);
            setHideCategory(true);
            setHideSubcategory(false);
            setHideLeafCategory(true)
        }
    }


    useEffect(() => {
        getTrayFilterData();
    }, []);

    useEffect(() => {
        if (localStorage.getItem("filterArrayList")) {
            localStorage.removeItem('filterArrayList');
        }
        let timeOutId = setTimeout(() => {
            getAllUsers();
        }, 200);
        timeOutIDs.current.push(timeOutId);


    }, [filterParams]);



    const resetCriteria = () => {
        setFilterParams({
            "userIds": [],
            "searchProperty": "",
            "pageNumber": 0,
            "cardCount": 0,
            "filterValues": [[GuidFormat.EMPTYGUID]]
        })
        setStartIndex(0);
        setEndIndex(cardCount);
        setCurrentPage(1)
        setSearchInput("");
        localStorage.removeItem('filterArrayList');
        setFilterArray([]);
    }

    const getAllUsers = () => {
        getAllUsersForCandidateName()
            .then(res => {
                if (res.data) {
                    if (isMounted()) {
                        let response = res.data.filter(obj => obj.isActive && !obj.isSuspended)
                        setAllUserList(response);
                        getCandidateDetails(response);
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
                                return users.some(item => item.id === obj.applicationUserId && !obj.isSuspended)
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
                                educationStatus: "",
                                genderDescription: ""
                            }))
                            candidateObject.map(obj => {
                                users.map(data => {
                                    if (obj.applicationUserId === data.id) {
                                        return obj.learnerName = data.firstName + " " + data.lastName;
                                    }
                                })
                            })
                            candidateObject.map(obj => {
                                users.map(data => {
                                    if (obj.applicationUserId === data.id) {
                                        return obj.genderDescription =
                                            obj.gender === Gender.MALE ? 'Male' :
                                                obj.gender === Gender.FEMALE ? 'Female' :
                                                    obj.gender === Gender.PREFERNOTTOSAY ? 'Prefer Not to Answer' : '';
                                    }
                                })
                            })
                            setTotalPages(Math.ceil(res.data.candidateCardList.$values.length / cardCount));
                            setTotalCardCount(res.data.totalCardCount);
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
                        responseData.map(data => {
                            if (res.data.$values.find(obj => obj.learnersId === data.applicationUserId)) {
                                data.carrerSpecialization = res.data.$values.find(obj => obj.learnersId === data.applicationUserId).carrerSpecialization.replace(/\n/g, '');
                                data.weeksToComplete = res.data.$values.find(obj => obj.learnersId === data.applicationUserId).weeksToComplete;
                                data.graduationDate = res.data.$values.find(obj => obj.learnersId === data.applicationUserId).graduationDate;
                                data.progressPercentage = (res.data.$values.find(obj => obj.learnersId === data.applicationUserId).currentWeek / res.data.$values.find(obj => obj.learnersId === data.applicationUserId).totalWeek) * 100;
                                data.educationStatus = res.data.$values.find(obj => obj.learnersId === data.applicationUserId).educationStatus;
                            }
                        })

                        getAllInstitutions(responseData, res.data.$values)
                    }
                }
            })
    }

    const getAllInstitutions = async (responseData, enrolledData) => {
        getOrganizationTypes()
            .then(async (res) => {
                if (isMounted()) {
                    const knowledgeData = await res.data.find(item =>
                        item.type === OrganizationTypes.KNOWLEDGEPARTNER);
                    const list = knowledgeData.organizationList
                    setOrganization(list);
                    //setting institution name 
                    responseData.map(data => {
                        if (enrolledData.find(obj => obj.learnersId === data.applicationUserId)) {
                            let latestEnrolled = enrolledData.find(obj =>
                                obj.learnersId === data.applicationUserId)
                            if (latestEnrolled) {
                                if (list.find(inst => inst.id === latestEnrolled.institutionId)) {
                                    return data.institutionName =
                                        list.find(inst => inst.id === latestEnrolled.institutionId).organizationName;
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
                                if (messageData.find(obj =>
                                    obj.secondaryUserId === data.applicationUserId)) {
                                    return data.unreadMessageCount = messageData.find(obj =>
                                        obj.secondaryUserId === data.applicationUserId).unreadMessageCount;
                                }
                            })
                        }
                    }
                }
                setCandidateList(responseData);
                setCandidateListFilter(responseData);
                // setFilterList(responseData);
            })
            .catch(err => console.log(err))
    }

    const mangePagination = (data) => {
        setStartIndex(0)
        setEndIndex(cardCount)
        setCurrentPage(1);
        setTotalPages(data?.length > cardCount ? Math.ceil(data?.length / cardCount) : 1)
        setTotalCardCount(data.length)
    }

    useEffect(() => {
        let result = [];
        if (filterArray?.length > 0 && searchInput?.length === 0) {
            if (filterArray.some(obj => obj.filterHeader === "careers") &&
                filterArray.some(obj => obj.filterHeader === "gender")) {
                result = candidateListFilter.filter((item) => {
                    return (filterArray.some(obj => obj.filterName.toLowerCase() === item.carrerSpecialization.toLowerCase()) &&
                        filterArray.some(obj => obj.filterName.toLowerCase() === item.genderDescription.toLowerCase()))
                })
            } else {
                result = candidateListFilter.filter((item) => {
                    return (filterArray.some(obj => obj.filterName.toLowerCase() === item.carrerSpecialization.toLowerCase()) ||
                        filterArray.some(obj => obj.filterName.toLowerCase() === item.genderDescription.toLowerCase()))
                })

            }

            localStorage.setItem("filterArrayList", JSON.stringify(filterArray))
            setFilterList(result);
            setCandidateList(result);
            mangePagination(result);
        } else if (filterArray?.length > 0 && searchInput?.length > 0) {
            if (filterArray.some(obj => obj.filterHeader === "careers") &&
                filterArray.some(obj => obj.filterHeader === "gender")) {
                result = candidateListFilter.filter((item) => {
                    return (filterArray.some(obj => obj.filterName.toLowerCase() === item.carrerSpecialization.toLowerCase()) &&
                        filterArray.some(obj => obj.filterName.toLowerCase() === item.genderDescription.toLowerCase()))
                        && item.learnerName.toLowerCase()?.indexOf(searchInput) !== -1
                })
            } else {
                result = candidateListFilter.filter((item) => {
                    return ((filterArray.some(obj => obj.filterName.toLowerCase() === item.carrerSpecialization.toLowerCase()) ||
                        filterArray.some(obj => obj.filterName.toLowerCase() === item.genderDescription.toLowerCase()))) &&
                        item.learnerName.toLowerCase()?.indexOf(searchInput) !== -1
                })

            }
            localStorage.setItem("filterArrayList", JSON.stringify(filterArray))
            setFilterList(result);
            setCandidateList(result);
            mangePagination(result)

        } else if (filterArray?.length === 0 && searchInput?.length > 0) {
            result = candidateListFilter.filter(obj => {
                return obj.learnerName.toLowerCase()?.indexOf(searchInput) !== -1
            })
            localStorage.removeItem('filterArrayList');
            setCandidateList(result);
            mangePagination(result);
            setFilterList(result);
        } else {
            localStorage.removeItem('filterArrayList');
            setCandidateList(candidateListFilter)
            mangePagination(candidateListFilter);
            setFilterList(candidateListFilter);
        }

    }, [filterArray])


    //Checkbox filter
    const selectFilter = (selectedCriteria, event) => {
        if (selectedCriteria && event) {
            if (event.target.checked) {
                setFilterArray(prevData => [...prevData, {
                    'filterName': selectedCriteria.filterName,
                    'filterHeader': selectedCriteria.mainHeadText.toLowerCase()
                }])
            } else {
                setFilterArray(filterArray.filter(obj =>
                    obj.filterName.toLowerCase() !== selectedCriteria.filterName.toLowerCase()))
            }
        }

    }

    const clearLeafFilterFromSubcategory = (data) => {
        if (data) {
            let list = filterArray.filter(obj => {
                return !data.some(item => obj.filterName.toLowerCase() === item.filterName.toLowerCase())
            })
            setFilterArray(list)
        }

    }

    //card search box
    const searchCard = (searchValue) => {
        let candidates = [];
        setSearchInput(searchValue)
        if (filterArray?.length > 0 && searchValue?.length > 0) {
            candidates = filteredList.filter(obj => {
                return obj.learnerName.toLowerCase()?.indexOf(searchValue) !== -1
            })
        } else if (filterArray?.length > 0 && searchValue?.length === 0) {
            if (filterArray.some(obj => obj.filterHeader === "careers") &&
                filterArray.some(obj => obj.filterHeader === "gender")) {
                candidates = candidateListFilter.filter((item) => {
                    return (filterArray.some(obj => obj.filterName.toLowerCase() === item.carrerSpecialization.toLowerCase()) &&
                        filterArray.some(obj => obj.filterName.toLowerCase() === item.genderDescription.toLowerCase()))
                })
            } else {
                candidates = candidateListFilter.filter((item) => {
                    return (filterArray.some(obj => obj.filterName.toLowerCase() === item.carrerSpecialization.toLowerCase()) ||
                        filterArray.some(obj => obj.filterName.toLowerCase() === item.genderDescription.toLowerCase()))
                })
            }
        } else {
            candidates = candidateListFilter.filter(obj => {
                return obj.learnerName.toLowerCase()?.indexOf(searchValue) !== -1
            })
        }
        setFilterList(candidates);
        setCandidateList(candidates);
        mangePagination(candidates);

    }


    //pagination
    const next = () => {
        if (endIndex < candidateList.length) {
            setStartIndex(startIndex + cardCount)
            setEndIndex(endIndex + cardCount)
            setCurrentPage(currentPage + 1);
            setTotalCardCount(totalCardCount - cardCount)
        }
    }
    const previous = () => {
        if (startIndex > 0) {
            setStartIndex(startIndex - cardCount);
            setEndIndex(endIndex - cardCount);
            setCurrentPage(currentPage - 1);
            setTotalCardCount(totalCardCount + cardCount)
        }

    }

    //school,badge,career,graduation date
    const filterByQualifications = (val, criteria) => {
        if (val) {
            let careerCriteria = { val, criteria }
            localStorage.setItem('careerCriteria', JSON.stringify(careerCriteria));
            let timeOutId = setTimeout(() => {
                navigate("/portal/learners");
            }, 400);
            timeOutIDs.current.push(timeOutId);

        }

    }
    const checkIsFiltered = () => {
        if (localStorage.getItem('filterArrayList')) {
            let filterList = JSON.parse(localStorage.getItem('filterArrayList'));
            if (filterList?.length > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    return (
        <div className="candidate-section candidate-tray-filter-main d-flex">
            <div className="col-xl-3 col-lg-3 col-md-3">
                {isCategory && isSubcategory &&
                    <div className="card shadow mb-4 filter-card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-8">
                                    <div className="filter-head">{checkIsFiltered() ? 'Filter Results ' : 'Filter Recruits'}</div>
                                </div>
                                <div className="col-md-4 reset-area">
                                    <div className="reset mr-1" onClick={resetCriteria}>Reset</div>
                                </div>
                            </div>
                        </div>

                        <CategoryComponent
                            category={categoryList}
                            onSelectCategory={onSelectCategory}
                            allLeafNodes={allLeafNodes}
                            selectFilter={selectFilter} />
                    </div>
                }
                {!isCategory && isSubcategory && !isLeafCategory &&
                    <SubCategoryComponent
                        subcategory={filteredSubcategory}
                        headerName={header}
                        onSelectSubcategory={onSelectSubcategory}
                        allCategory={allCategory}
                        selectFilter={selectFilter}
                        clearLeafFilterFromSubcategory={clearLeafFilterFromSubcategory}

                    />
                }
                {isCategory && !isSubcategory && isLeafCategory && !isFilter && <div>
                    <LeafNodeComponent
                        leafCategory={leafCategoryList}
                        headerName={header}
                        subHeaderName={subHeader}
                        onSelectLeafCategory={onSelectLeafCategory} />

                </div>
                }
                {isCategory && !isSubcategory && isLeafCategory && isFilter &&
                    <FilterComponent
                        filterCriteria={filterCriteriaList}
                        backFromFilter={backFromFilter}
                        selectFilter={selectFilter} />

                }

            </div>

            <div className="col-xl-7 col-lg-8 col-md-9 col-sm-10">

                <div className="container-fluid">
                    <div className="d-flex">
                        {/*...... search box starting...... */}
                        <div className="col-7 mb-2 pl-0">
                            <div className="candidate-search">
                                <input className="filter-searchbox py-2" id="search-input" type="search"
                                    onChange={(e) => searchCard(e.target.value)} value={searchInput}
                                    autoComplete="off" name="search"
                                    placeholder={location.pathname === '/portal/dashboard' ? "Search by name" : 'Search Recruits'} />
                            </div>
                        </div>
                        {/*...... search box end...... */}

                        {location.pathname === '/portal/dashboard' && <div className="pagination mt-2 ml-auto">
                            {candidateList.length > 0 && <p className="subText mb-0 mt-1 mr-4">Page {currentPage} of {totalPages}</p>}
                            <div className="filter-pagearrow">
                                <span className={currentPage === 1 ? "material-icons filter-arrow-disabled" : 'material-icons filter-arrow'} onClick={previous}>arrow_back_ios</span>
                                <span className={currentPage === totalPages ? "material-icons filter-arrow-disabled mr-0" : 'material-icons filter-arrow mr-0'} onClick={next}>arrow_forward_ios</span>
                            </div>
                        </div>}

                    </div>
                </div>
                <div className="container-fluid candidate-cards-section">
                    {candidateList.length == 0 && <span className="no-results-card">No results found!</span>}
                    <div className={location.pathname === '/portal/dashboard' ? 'row' : 'row overflow-class'}>
                        {
                            location.pathname === '/portal/dashboard' && candidateList?.length > 0 && candidateList.slice(startIndex, endIndex).map((candidate, i) => (
                                <CandidateCardComponent key={i}
                                    {...candidate}
                                    filterByQualifications={filterByQualifications}
                                    cardColumns="col-6"
                                />
                            ))
                        }
                        {
                            location.pathname !== '/portal/dashboard' && candidateList?.length > 0 && candidateList.map((candidate, i) => (
                                <CandidateCardComponent key={i}
                                    {...candidate}
                                    filterByQualifications={filterByQualifications}
                                    cardColumns="col-6"

                                />
                            ))
                        }

                    </div>
                    {location.pathname === '/portal/dashboard' && <div className="view-section viewLink-2 text-right">
                        {totalCardCount > cardCount && <span className="smallText text-uppercase pr-100">{totalCardCount - cardCount} more results</span>}
                        <Link to="/portal/recruiting" className="link-decoration-none ml-4 view-all-btn">VIEW ALL</Link>
                    </div>}

                </div>
            </div>
        </div>

    )
}

export default CandiadateTrayfilterContainer

