import React, { useEffect } from 'react'
import "../../modules/faq/faq.scss";
function Confirm() {
    //const params = new URLSearchParams(location.search);
    useEffect(() => {
        let url = window.location.href;
        let newLocation = "scheme" + ":" + url;
        window.location.replace(newLocation);
    }, []);

    return (
        <div id='main'></div>
    )
}

export default Confirm