import React from "react";
import './customCheckbox.scss';

const DataTableCustomCheckbox = React.forwardRef(({ onClick, ...rest }, ref) => (
    <>
        <div className="form-check filter-checkboxes custom-check-table">
            <label className="custom-control overflow-checkbox">
                <input
                    htmlFor="booty-check"
                    className="form-check-input career-checkbox overflow-control-input"
                    type="checkbox" ref={ref}
                    onClick={onClick}
                    {...rest}
                />
                <span className="overflow-control-indicator"></span>
            </label>
            <label className="form-check-label text-5" id="booty-check"></label>
        </div>
    </>
));

export default DataTableCustomCheckbox;