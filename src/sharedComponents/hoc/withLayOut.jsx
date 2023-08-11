import React from 'react';

import NavigationBarComponent from '../navigationBar/navigationBarComponent';


const WithLayout = (Component) => () => {
    
    return (
        <React.Fragment>
            <NavigationBarComponent />
            <Component />
        </React.Fragment>
    )
}

export default WithLayout;
