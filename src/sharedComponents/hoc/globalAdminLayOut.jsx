import React from 'react';
import AdminNavigationBarComponent from '../adminNavigationBar/adminNavigationBarComponent';

const GlobalAdminLayOut = (Component) => () => {

    return (
        <React.Fragment>
            <AdminNavigationBarComponent />
            <Component />
        </React.Fragment>
    )
}

export default GlobalAdminLayOut

