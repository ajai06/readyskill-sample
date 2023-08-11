import React from "react";
import Pagination from "react-bootstrap/Pagination";
import "./customTable.scss";

const CustomPaginationComponent = ({
    count,
    page,
    rowsPerPage,
    onChangePage,
    currentPage,
    alphabetFilter,
    checkLetterFoundInList
}) => {

    const getNumberOfPages = (rowCount, rowsPerPage) =>
        Math.ceil(rowCount / rowsPerPage);

    const handleBackButtonClick = () => {
        page === 0 ? onChangePage(1) : onChangePage(page);
    };

    const handleNextButtonClick = () => {
        onChangePage(page + 2);
    };

    let alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

    let disbaledClass = {
        pointerEvents: "none",
        opacity: 0.5
    }

    return (
        <div className="mt-3 d-flex justify-content-between custom-aplha-pagination">
            <div>
                <span className="mx-1 sorting-alphabets" onClick={() => alphabetFilter("All")}>All</span>
                {
                    alphabets.map((letter,index) => (
                        <span style={!checkLetterFoundInList(letter) ? disbaledClass : {}} key={index} className="mx-1 sorting-alphabets"
                            onClick={() => alphabetFilter(letter)}>{letter}</span>
                    ))
                }
            </div>
            <div className="d-flex ml-auto">
                <Pagination>
                    <Pagination.Item
                        onClick={handleBackButtonClick}
                        aria-disabled={page === 0}
                        disabled={page === 0}
                        aria-label="previous page"
                        className="pagination-arrow"
                    >
                        &lt;
                    </Pagination.Item>
                    <Pagination.Item
                        aria-label="previous page"
                    >
                        Page {currentPage} of {getNumberOfPages(count, rowsPerPage)}
                    </Pagination.Item>
                    <Pagination.Item
                        onClick={handleNextButtonClick}
                        disabled={page >= getNumberOfPages(count, rowsPerPage) - 1}
                        aria-label="next page"
                        className="pagination-arrow"
                    >
                        &gt;
                    </Pagination.Item>
                </Pagination>
            </div>
        </div>
    );
};


export default CustomPaginationComponent;