import React from 'react'

function SupportServices({ externalServiceProviders, socialList, readySKillServiceProviders }) {
    
    const getServiceProvider = (data) => {
        if (externalServiceProviders || readySKillServiceProviders) {
            let obj = externalServiceProviders.find(obj => obj.id === data.serviceProviderId);
            if (obj) {
                return `${obj.partnerServiceName} ( ${obj.location.$values[0].locationName} )`;
            } else {
                let item = readySKillServiceProviders.find(itm => itm.id === data.serviceProviderId);
                if(item) {
                    return `${item.partnerServiceName} ( ${item.city + ', ' + item.state} )`;
                } else {
                    return "";
                }
            }

        } else {
            return "";
        }
    }

    return (
        <div className="ml-3">
            {
                socialList.slice(0, 2).map(social => (
                    <p key={social.id} className="inner-sub text-capitalize mb-1">{getServiceProvider(social)}</p>
                ))
            }
        </div>
    )
}

export default SupportServices