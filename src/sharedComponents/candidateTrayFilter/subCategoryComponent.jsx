import React, { useState, useEffect } from 'react'
import HeaderComponent from './headerComponent'

function SubCategoryComponent({ subcategory, onSelectSubcategory, allCategory, selectFilter, clearLeafFilterFromSubcategory }) {
    const [subCategoryList, setSubcategory] = useState(subcategory);
    const [subCategoryListFilter, setSubcategoryListFilter] = useState(subcategory);
    const [header, setHeader] = useState('');
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(6);
    const [totalPagesNum, setPagesNumber] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);
    const [PerPage] = useState(7)
    const [leafNodeList, setLeafNodeList] = useState([]);
    const [searchString, setSearchString] = useState("");

    const selectSubcategory = (subcategory) => {
        onSelectSubcategory(false, subcategory)
    }
    const back = () => {
        onSelectSubcategory(true);
    }
    const selectCriteria = (selectedData, evt) => {
        selectFilter(selectedData, evt)

    }
    const next = () => {
        if (endIndex < subCategoryList.length) {
            setEndIndex(endIndex + 6);
            setStartIndex(startIndex + 6);
            setCurrentPage(currentPage + 1);
        }
    }
    const previous = () => {
        if (startIndex > 0) {
            setEndIndex(endIndex - 6);
            setStartIndex(startIndex - 6);
            setCurrentPage(currentPage - 1);
        }
    }

    const getPaginationData = () => {
        const totalPages = Math.ceil(subCategoryListFilter.length / PerPage);
        setPagesNumber(totalPages);

    }

    const search = async (value) => {
        let categoryData = [];
        allCategory.$values.map(obj => {
            obj.$values.map(res => {
                if ((res.mainParent === subcategory[0].mainParent) && res.leafNode && res.filterLevel !== 0) {
                    categoryData.push(res);
                }
            })
        });
        let filteredList = [];
        if (value?.length > 0) {
            setSearchString(value);
            filteredList = categoryData.filter(category => {
                return category.filterName.toLowerCase().includes(value.toLowerCase())
            })
            setLeafNodeList(filteredList);
            setTimeout(() => {
                getCheckedData();
            }, 100);

        } else {
            // let leafList = leafNodeList;
            setSearchString("")
            setLeafNodeList([]);
            // clearLeafFilterFromSubcategory(leafList);
        }

    }

    const getCheckedData = () => {
        if (localStorage.getItem('filterArrayList')) {
            let criteriaList = JSON.parse(localStorage.getItem('filterArrayList'));
            if (criteriaList.length > 0) {
                criteriaList.map(obj => {
                    if (document.getElementById(obj.filterName)) {
                        return document.getElementById(obj.filterName).checked = true;
                    }
                })
            }
        }
    }

    const resetPaginationIndex = () => {
        setStartIndex(0);
        setEndIndex(7);
        setCurrentPage(1);
    }

    useEffect(() => {
        if (subCategoryList) {
            let headerText = subCategoryList[0].mainHeadText;
            setHeader(headerText)
        }
        getPaginationData()
    }, [])



    return (
        <div className="card shadow mb-4 filter-card">
            <div className="card-header">
                <span className="material-icons filter-arrow back-arrow" onClick={back}>arrow_back_ios</span>
                <HeaderComponent headerName={header} />
            </div>
            <div className="card-header">
                <div className="filter-search">
                    <input className="filter-searchbox"
                        onChange={(e) => { search(e.target.value) }} type="search" autoComplete="off" name="search" placeholder="Search" />
                </div>
                <div className={leafNodeList?.length > 0 ? 'search-results' : ''}>
                    {leafNodeList.length === 0 && searchString?.length > 0 && <span className="no-results text-center">No results found!</span>}
                    {
                        leafNodeList.map(data => (<div className="form-check filter-checkboxes" key={data.$id}>
                            <label className="custom-control overflow-checkbox">
                                <input className="form-check-input career-checkbox overflow-control-input" type="checkbox" onChange={(e) => {
                                    selectCriteria(data, e)
                                }} value='' id={data.filterName} />
                                <span className="overflow-control-indicator"></span>
                            </label>
                            <label className="form-check-label text-5 ml-2" htmlFor={data.id}>{data.filterName}</label>
                        </div>))
                    }

                </div>
            </div>
            <div className="card-body">
                <div className="main-category">
                    {subCategoryList?.length === 0 && <span className="no-results">No results found!</span>}
                    {subCategoryList.slice(startIndex, endIndex).map(data => {
                        return (<div className="row" key={data.$id} onClick={() => { selectSubcategory(data) }}>
                            <div className="col-xl-10 col-lg-10 col-md-10 industries-filter">{data.filterName}</div>
                            <div className="col-xl-2 col-lg-2 col-md-2"><span className="material-icons filter-arrow">arrow_forward_ios</span></div>
                        </div>)
                    })}
                </div>
            </div>

            <div className="card-footer">
                <div className="filter-pagination">
                    <div className="filter-pages">
                        <p className="subText mb-0 mt-1">Page {currentPage} of {totalPagesNum}</p>
                    </div>
                    <div className="page-arrows">
                        <span className={currentPage === 1 ? "material-icons filter-arrow-disabled" : 'material-icons filter-arrow'} onClick={previous}>arrow_back_ios</span>
                        <span className={currentPage === totalPagesNum ? "material-icons filter-arrow-disabled mr-0" : 'material-icons filter-arrow mr-0'} onClick={next}>arrow_forward_ios</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SubCategoryComponent
