import React from 'react';
import FadeLoader from 'react-spinners/FadeLoader';

import './fallback.scss'

function FallBack() {

    const styles = {
        'display': 'flex',
        'justifyContent':'center',
        'position': 'fixed',
        'alignItems': 'center',
        'height': '100%',
        'backgroundColor': '#302e5f',
        'width': '100%',
        'zIndex': '100'
    }
    let color = '#FFFFFF'

    return (
        <div style={styles}>
            <FadeLoader color={color}  loading={true} size={25} />
        </div>

    )
}

export default FallBack
