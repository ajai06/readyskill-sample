import React, { useEffect, useState } from 'react';

import { useIsMounted } from '../../utils/useIsMounted';

import { getAllOrgizationsTypesList } from '../../services/adminServices';
import { OrganizationTypes, ResourcesList } from '../../utils/contants';
import { ConstText } from '../../utils/constantTexts';
import { getExternalPartnerServices } from '../../services/locationService';

function EnrolledServices({ enrolledData, headerText, cds }) {

    const isMounted = useIsMounted();
    const [externalServiceProviders, setExternalServiceProviders] = useState([]);
    const [readySKillServiceProviders, setReadySKillServiceProviders] = useState([])

    useEffect(() => {
        getPartnerServiceDetails();
    }, [])


    const getPartnerServiceDetails = () => {

        getAllOrgizationsTypesList()
            .then((res) => {
                if (res.data) {
                    if (isMounted()) {
                        let response = res.data.filter(
                            (obj) => obj.type === OrganizationTypes.SERVICEPARTNER
                        )[0].organizationList;
                        setReadySKillServiceProviders(response);
                    }
                }
            })
            .catch((err) => console.log(err));


            getExternalPartnerServices()
            .then(res => {
                if (res.data.$values?.length > 0) {
                    if (isMounted()) {
                        let response = res.data.$values
                        setExternalServiceProviders(response);
                    }
                }
            })
            .catch(err => console.log(err))
    }

    const getServiceProviderOrgName = (data) => {

        if (externalServiceProviders || readySKillServiceProviders) {
            let obj = externalServiceProviders.find(obj => obj.id === data.serviceProviderId);
            if (obj) {
                return `${obj.partnerServiceName}`;
            } else {
                let item = readySKillServiceProviders.find(itm => itm.id === data.serviceProviderId);
                if (item) {
                    return `${item.partnerServiceName}`;
                } else {
                    return "N/A";
                }
            }

        } else {
            return "N/A";
        }
    }

    const getServicePartnerType = (data) => {

        if (externalServiceProviders || ResourcesList) {
            if (externalServiceProviders.find((obj) => obj.id === data.serviceProviderId)) {
                let resource = externalServiceProviders.map(obj => {
                    if (obj.resourceType.$values.find(item => item.id === data.serviceId)) {
                        return `${obj.resourceType.$values.find(item => item.id === data.serviceId).serviceName}`
                    } else {
                        return "N/A"
                    }
                })
                return resource;
            } else if (ResourcesList.find(obj => obj.id === data.serviceId)) {
                return `${ResourcesList.filter((obj) => obj.id === data.serviceId)[0].serviceName}`;
            } else {
                return "N/A"
            }
        } else {
            return "N/A"
        }
    };

    return (
        <div className="col-xl-12 col-lg-12 col-md-12 pb-3" >
            <div className="card shadow career-card">
                <div className="card-header">
                    <p className="subHead-text mb-3">{headerText}</p>
                </div>
                {
                    cds
                        ? <div className="text-6 py-3 w-100 text-center" style={{ color: 'white' }}>{ConstText.NODATA}</div>
                        : ''
                }
                <div className="enrolled-overflow">
                    {
                        enrolledData && enrolledData.map(enrolled => (

                            <div key={enrolled.$id} className="career-card-inner">
                                <div className="card-body  bb-1 py-1 ">
                                    <div className="d-flex mt-1">
                                        <span className="material-icons career-icon mr-0 mt-2">
                                            terrain
                                        </span>
                                        <div className="ml-3">
                                            <p className="activity-text text-capitalize mb-0">
                                                {/* {enrolled.serviceName} */}
                                                <span>{getServicePartnerType(enrolled)}</span>
                                            </p>
                                            <p className="note-dateText text-uppercase">
                                                {getServiceProviderOrgName(enrolled)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default EnrolledServices
