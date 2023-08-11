import React, {useState, useContext, createContext } from 'react';

import FadeLoader from 'react-spinners/FadeLoader'

// import { css } from "@emotion/react";


// const override = css`
// display: flex;
// justify-content: center;
// position: fixed;
// align-items: center;
// height: 100%;
// background-color: rgb(10 10 10 / 50%);
// width: 100%;
// z-index: 100;
// `;

const styles = {
    'display': 'flex',
    'justifyContent':'center',
    'position': 'fixed',
    'alignItems': 'center',
    'height': '100%',
    'backgroundColor': 'rgb(10 10 10 / 50%)',
    'width': '100%',
    'zIndex': '100'
}

const LoaderDispatchContext = createContext();

export const useLoaderDispatch = () => {

    const context = useContext(LoaderDispatchContext);
    return context;
}

export const LoaderContext = ({ children }) => {

    let [loading, setLoading] = useState(false);
    let color = '#FFFFFF'

    return(
        <LoaderDispatchContext.Provider value={setLoading}>
            {
                loading ?
                <div style={styles}>
                    <FadeLoader color={color}  loading={loading} size={25} />
                </div> : ''
            }
            {children} 
        </LoaderDispatchContext.Provider>
    )
}
