import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable, { createTheme } from 'react-data-table-component';

// import { getOrganizationList } from '../../../services/apiServices';

import { getOrganizationList } from '../../../services/organizationServices';

import DashboardHeaderComponent from '../../../sharedComponents/dashboardHeader/dashboardHeaderComponent';
import WithLayout from '../../../sharedComponents/hoc/withLayOut';
import Breadcrumbs from '../../../sharedComponents/BreadCrumbs/breadCrumbs'; 


import { useToastDispatch } from '../../../context/toast/toastContext';
import { UserAuthState } from '../../../context/user/userContext';

import './organization.scss';

function OrganizationContainer() {

    // createTheme creates a new theme named solarized that overrides the build in dark theme
    createTheme('solarized', {
        text: {
            primary: '#9391b6',
            secondary: '#9391b6',

        },
        background: {
            default: '#181633',
        },
        context: {
            background: '#cb4b16',
            text: '#FFFFFF',
        },
        divider: {
            default: '#2f2c52',
        },
        action: {
            button: 'rgba(0,0,0,.54)',
            hover: 'rgba(0,0,0,.08)',
            disabled: 'rgba(0,0,0,.12)',
        },
    }, 'dark');

    // const customStyles = {
    //     headRow: {
    //         style: {
    //             border: 'none',
    //         },
    //     },
    //     headCells: {
    //         style: {
    //             color: '#202124',
    //             fontSize: '14px',
    //         },
    //     },
    //     rows: {
    //         highlightOnHoverStyle: {
    //             backgroundColor: 'rgb(230, 244, 244)',
    //             borderBottomColor: '#FFFFFF',
    //             borderRadius: '25px',
    //             outline: '1px solid #FFFFFF',
    //         },
    //     },
    //     pagination: {
    //         style: {
    //             border: 'none',
    //         },
    //     },
    // };

    //custom column sorting
    const customSort = (rows, selector, direction) => {
        return rows.sort((rowA, rowB) => {
          // use the selector function to resolve your field names by passing the sort comparitors
          const aField = selector(rowA);
          const bField = selector(rowB);
    
          let comparison = 0;
    
          if (aField?.toLowerCase() > bField?.toLowerCase()) {
            comparison = 1;
          } else if (aField?.toLowerCase() < bField?.toLowerCase()) {
            comparison = -1;
          }
    
          return direction === "desc" ? comparison * -1 : comparison;
        });
      };

    const navigate = useNavigate();
    
    const toast = useToastDispatch();
    const userState = UserAuthState();
    const [organizations, setOrganizations] = useState([]);
    const [globalAdmin, setGlobalAdmin] = useState(false);

    const mountedRef = useRef(false);

    useEffect(() => {
        mountedRef.current = true
        return () => {
            mountedRef.current = false
        }
    }, []);

    useEffect(() => {
        const roles = userState.user.roleName;
        const gobalAdminRoleCheck = roles.includes("Global Admin");
        if (gobalAdminRoleCheck && mountedRef) {
            setGlobalAdmin(true);
        }
        
        setTimeout(() => {
            getAllOrganizationList();
        }, 300);
       

    }, []);

    // get all organization
    const getAllOrganizationList = () => {
        
        getOrganizationList(userState.user.id)
            .then(res => {
                if(mountedRef){
                    setOrganizations(res.data);
                }
            })
            .catch(err => {
                
                if (err.response && err.response.statusText) {
                    toast({ type: "error", text: err.response.statusText })
                }
                console.log(err.response)
            });
    }

    const rowSelection = (row) => {
        navigate(`/portal/organizationDetails/${row.id}`, {state: { organization: row }})
    }

    const columns = [
        {
            name: 'Organization Name',
            sortable: true,
            cell: (row) => (
                <a style={{ textDecoration: 'underline' }} onClick={() => rowSelection(row)}>
                    {row.organizationName}
                </a>
            )
        },
        {
            name: 'Organization Type',
            selector: row => row.organizationTypeInfo.type,
            sortable: true,
        },
        {
            name: 'Administrative User Name',
            selector: row => row.administrativeUser,
            sortable: true,
        },
        {
            name: 'Administrative User Email',
            selector: row => row.administrativeUserEmail,
            sortable: true,
        }
        
    ];

    return (
        <div id="main" className="organization-list-container">
            <DashboardHeaderComponent headerText="Organization list" />
            <Breadcrumbs />
            <div className="add-org">
                {
                    globalAdmin ? <button className="add-org-btn" onClick={() => navigate("/portal/add_organization")}>Add Organization</button> : ''
                }
            </div>

            {organizations && organizations.length > 0 && 
                <div className="card org-list-card shadow mt-4">
                    <DataTable
                        columns={columns}
                        sortFunction={customSort}
                        data={organizations}
                        pagination={globalAdmin ? true : false}
                        pointerOnHover
                        highlightOnHover
                        // customStyles={customStyles}
                        theme="solarized"
                    />
                </div>
            }
        </div>
    )
}

export default WithLayout(OrganizationContainer);
