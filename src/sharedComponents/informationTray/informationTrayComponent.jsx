import React, { useState } from 'react';
import { useEffect } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import { UserAuthState } from '../../context/user/userContext';

import './informationTray.scss'

const InformationTrayComponent = ({ trayInformation }) => {

    const [trayInfo, setTrayInfo] = useState([]);
    const userState = UserAuthState();

    useEffect(() => {
        setTrayInfo(trayInformation)
        return () => {
            setTrayInfo([]);
        }
    }, [trayInformation]);

    return (
        <div className="container-fluid info-tray-main">
            {
                userState.trayEnabled &&
                <div className="row">
                    {trayInfo.length > 0 ? trayInfo.map(tray => {
                        return (
                            <div className="col-xl-3 col-md-6 mb-4" key={tray.$id}>
                                <div className="card shadow h-100 py-2 info-tray">
                                    <div className="card-body info-tray">
                                        <span className='icon-1 mr-2' style={{ background: tray.backgroundColor ? tray.backgroundColor : "#0C2B44" }}>
                                            {/* <i className="material-icons tray-icons" style={{ background: tray.logoColor ? tray.logoColor : "#289EE7" }}>{tray.trayIcon}</i> */}
                                            {tray.trayIcon?.length > 0 && <img src={require(`../../assets/img/infoTrayIcons/${tray.trayIcon}`)} className="infoTray-icons" alt='' />}
                                        </span>
                                        <div className="col mr-2 tray-details">
                                            <h5 className="boldText mb-1">{tray.count}</h5>
                                            <p className="mb-0 subText text-uppercase">{tray.headingText}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }) : <div className="col-xl-3 col-md-6 mb-4"><ClipLoader color={"#2a9fd8"} loading={true} size={50} /></div>}
                </div>
            }

        </div>
    )
}

export default (InformationTrayComponent)
