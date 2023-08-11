
import React from 'react'
import useBreadcrumbs from 'use-react-router-breadcrumbs';

import { NavLink } from 'react-router-dom';

import './breadcrumb.scss'

const Breadcrumbs = () => {
    
    const breadcrumbs = useBreadcrumbs();

    return(
        <div className="bread-crumb">
            {   breadcrumbs.map(({match,breadcrumb }) =>{
                    return(
                        <NavLink key={match.pathname} to={match.pathname} className="smallText text-uppercase navlink" >
                            {match.pathname==='/'||match.pathname==='/portal/dashboard'?'YOUR DASHBOARD > ': breadcrumb.props.children.replace("Portal","") }
                        </NavLink>
                    )}
                )
            }
        </div>
    )
};
export default Breadcrumbs
