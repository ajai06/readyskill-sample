import React from "react";
import { useLocation } from "react-router-dom";
import Pagination from "react-bootstrap/Pagination";
import "../dataTableCustomPaginationWithAlphabets/customTable.scss";

const DataTableCustomPagination = ({
    rowsPerPage,
    rowCount,
    onChangePage,
    onChangeRowsPerPage,
    currentPage,
}) => {

    const customStyles = {
        pagination: {
            style: {
                border: "none",
                backgroundColor: "transperant",
            },
        },
    };

    return (<CustomPaginationComponent
        component="nav"
        currentPage={currentPage}
        count={rowCount}
        rowsPerPage={rowsPerPage}
        page={currentPage - 1}
        onChangePage={onChangePage}
        onChangeRowsPerPage={({ target }) =>
            onChangeRowsPerPage(Number(target.value))
        }
        ActionsComponent={CustomPaginationComponent}
        paginationComponent={customStyles}
    />)
}

const CustomPaginationComponent = ({
    count,
    page,
    rowsPerPage,
    onChangePage,
    currentPage
}) => {
    const location = useLocation();
    const getNumberOfPages = (rowCount, rowsPerPage) =>
        Math.ceil(rowCount / rowsPerPage);

    const handleBackButtonClick = () => {
        page === 0 ? onChangePage(1) : onChangePage(page);
    };

    const handleNextButtonClick = () => {
        onChangePage(page + 2);
    };



    return (
        <div className="custom-pagination ml-auto mt-0 mr-1">
            <div className="d-flex ">
                <Pagination className={location.pathname.startsWith("/admin/learnerDetails") ?
                    "service-pagination" : location.pathname.startsWith("/portal/admin/managePlatform") ?
                    "platformIndustry-pagination" : location.pathname.startsWith("/portal/admin/learnerDetails") ?
                    "service-pagination" : location.pathname.startsWith("/portal/admin/OrganizationDetails")?"users-pagination":""}>
                    <Pagination.Item
                        onClick={handleBackButtonClick}
                        aria-disabled={page === 0}
                        disabled={page === 0}
                        aria-label="previous page"
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
                    >
                        &gt;
                    </Pagination.Item>
                </Pagination>
            </div>
        </div>
    );
};


export default DataTableCustomPagination;