import React, { useEffect,useState } from 'react'
import { setBaseUrl, setHeaders } from '../../services/apiServices';
import { AppConfig } from '../../services/config';

function BaseUrlManagement(props) {
    const [isReady,setIsReady]=useState(false)
    const getBaseUrl = () => {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let init = {
            method: "GET",
            headers: headers,

        }
        fetch("/app-config.json", init)
            .then((response) => {
                return response.json();
            })
            .then((obj) => {
                setBaseUrl(obj.baseUrl);
                AppConfig.setConfig(obj);
                setIsReady(true);
            })
            .catch(
                (err) => {
                    console.log(err.response, ' error')
                })
    }

    useEffect(() => {
        getBaseUrl();
        setHeaders();
    }, []);
    return (
        <>
            {isReady&&props.children}
        </>

    )
}

export default BaseUrlManagement