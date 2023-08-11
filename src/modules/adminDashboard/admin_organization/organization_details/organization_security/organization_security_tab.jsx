import React, { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form';
import { UserAuthState } from '../../../../../context/user/userContext'
import {
  getLoginOptions,
  getAccountLockoutOptions,
  saveAccountLockoutOptions,
  getSelectedAccountLockout,
  getGeoBlockingOptions,
  updateGeoBlockingOptions,
  updateLoginOptions,
  getExternalLoginTypesPortalSecurity
} from '../../../../../services/adminServices'

import { useToastDispatch } from "../../../../../context/toast/toastContext";
import { useIsMounted } from '../../../../../utils/useIsMounted';
import { clearAlert } from '../../../../../utils/contants';

function OrganizationSecurity({ organizationDetails }) {
  const { register, setValue } = useForm({ mode: 'onChange' });
  const userState = UserAuthState();
  const [loginTypeList, setLoginType] = useState([]);
  const [domainName, setDomainName] = useState("");
  const [selectedLoginTypes, setSelectedLoginType] = useState([]);
  const [isAuthOptions, setAuthOption] = useState(false);
  const [accountLockoutOptions, setAccountLockout] = useState([]);
  const [geoBlockingOptions, setGeoBlocking] = useState([]);
  const [isDomain, setIsDomain] = useState(false);
  const toast = useToastDispatch();
  const isMounted = useIsMounted();


  //timeout cleanup

  const timeOutIDs = useRef([]);

  useEffect(() => {
    return () => {
      let ids = timeOutIDs.current
      clearAlert(ids);
    };
  }, []);

  const loginOptionsRef = useRef([]);
  const addCheckBoxRef = (el) => {
    if (el && !loginOptionsRef.current.includes(el)) {
      loginOptionsRef.current.push(el);
    }
  };
  useEffect(() => {
    getLoginOptionDetails();
    getAccountLockoutDetails();
    // externalAuthenticationDetails();
  }, [])

  const getLoginOptionDetails = () => {
    getLoginOptions(organizationDetails.id)
      .then((res) => {
        if (res.data) {
          if (isMounted()) {
            externalAuthenticationDetails(res.data.organizationExternalLoginMapping);
            getGeoBlockingList();
            let timeOutId = setTimeout(() => {
              setValue("geoBlockId", res.data.geoBlockingId)
            }, 200);
            timeOutIDs.current.push(timeOutId);

          }
        }
      })
  }

  const externalAuthenticationDetails = (loginData) => {
    getExternalLoginTypesPortalSecurity()
      .then(res => {
        if (res.data) {
          if (isMounted()) {
            setLoginType(res.data);
            checkExternalLogins(loginData);
          }
        }
      })
  }

  const getAccountLockoutDetails = () => {
    getAccountLockoutOptions()
      .then((res) => {
        if (res.data) {
          if (isMounted()) {
            let response = res.data;
            setAccountLockout(response);
            getSelectedAccountLockoutDetails();
          }
        }
      })
      .catch(err => console.log(err))
  }

  const getGeoBlockingList = () => {
    getGeoBlockingOptions()
      .then((res) => {
        if (res.data) {
          if (isMounted()) {
            let response = res.data;
            setGeoBlocking(response);
          }
        }
      })
      .catch(err => console.log(err));
  }
  const checkExternalLogins = (data) => {
    if (data) {
      data.map((login, i) => {
        if (login.domainName.length > 0) {
          setDomainName(login.domainName);
        }
        // if (loginOptionsRef.current[i]?.id && login.isActive) {
        //   return loginOptionsRef.current[i].checked = true;
        // } else {
        //   return false;
        // }
        if (document.getElementById(login.externalLoginTypeId) && login.isActive) {
          return document.getElementById(login.externalLoginTypeId).checked = true;
        } else {
          return false;
        }
      })

      setSelectedLoginType(data);
    }
  }

  const getSelectedAccountLockoutDetails = () => {
    getSelectedAccountLockout(organizationDetails.id)
      .then((res) => {
        if (res.data) {
          if (isMounted()) {
            checkAccountLockout(res.data);
          }
        }
      })
  }

  const checkAccountLockout = (data) => {
    if (data) {
      data.map(obj => {
        if (document.getElementById(obj.id + 'lock')) {
          return document.getElementById(obj.id + 'lock').checked = true;
        } else {
          return false;
        }
      })
    }

  }

  const onSelectLoginType = (event, item) => {
    let params = {
      organizationId: organizationDetails.id,
      externalLoginTypeId: item.id,
      isActive: event.target.checked,
      editingField: "AUTHENTICATION"
    }

    updateLoginOptions(organizationDetails.id, params)
      .then((res) => {
        if (res.status === 204) {
          if (isMounted()) {
            getLoginOptionDetails();
          }
        }
      })
      .catch(err => console.log(err))
  }

  const saveDomain = () => {
    let params = {}
    params['organizationId'] = organizationDetails.id;
    params['domainName'] = domainName
    params['editingField'] = "LOGIN"
    updateLoginOptions(organizationDetails.id, params)
      .then((res) => {
        if (res.status === 204) {
          if (isMounted()) {
            toast({ type: "success", text: "Changes updated successfully" });
            getLoginOptionDetails();
          }
        }
      })
  }
  const setDomain = (domainName) => {
    setDomainName(domainName);
  }


  const onChangeGeoBlock = (data) => {
    let params = {}
    params['id'] = organizationDetails.id;
    params['geoBlockingId'] = data.id;
    params['geoBlockingException'] = data.geoBlockingOptions;
    updateGeoBlockingOptions(organizationDetails.id, params)
      .then((res) => {
        if (res.status === 204) {
          if (isMounted()) {
            //Auto save , no actions required
          }
        }
      })
      .catch((err) => console.log(err))

  }
  const onChangeAccountLockout = (e, item) => {
    let params = {}
    params['organizationId'] = organizationDetails.id;
    params['applicationUserId'] = userState.user.id;
    if (e.target.checked) {
      params['accountLockOutId'] = item.id;
    } else {
      params['accountLockOutId'] = item.id;
    }
    saveAccountLockoutOptions(params)
      .then((res) => {
        if (res.status === 204) {
          if (isMounted()) {
            //Auto save , no actions required
          }
        }
      })
      .catch(err => console.log(err))
  }
  const onSelectDomainCheck = (e) => {
    // e.preventDefault();
    if (e.target.checked) {
      setIsDomain(true)
    } else {
      setIsDomain(false)
    }
  }
  return (
    <div>
      <div className="card-body security-tab-body" disabled={userState.organizationEdit && userState.organizationReadonly ? false : true}>
        <div className="row">
          <div className="col-6" >
            <div className='d-flex'>
              <p className="subHead-text-learner mb-2 text-uppercase mt-3">
                LOGIN OPTIONS
              </p>
            </div>
            <div>
              <div className="d-flex">
                <div className="form-check filter-checkboxes">
                  <label className="custom-control overflow-checkbox ">
                    <input className="form-check-input career-checkbox overflow-control-input" id='domain' onChange={(e) => onSelectDomainCheck(e)} type="checkbox" name="isSponsoredProgram" />
                    <span className="overflow-control-indicator"></span>
                  </label>
                  <label className="form-check-label text-5 ml-2"></label>
                </div>
                <p className="inner-sub text-capitalize mb-3 ml-0">
                  Restrict Usernames to the following domain:
                </p>
              </div>
              <div className="form-outline w-75" disabled={isDomain ? false : true}>
                <input type="text" className="form-control mb-2" value={domainName} onBlur={() => {
                  setTimeout(() => {
                    saveDomain();
                  }, 200);
                }} onKeyPress={(e) => e.key === "Enter" ? saveDomain() : ""} onChange={(e) => setDomain(e.target.value)} placeholder="Domain" name="domain" />
              </div>
            </div>
            <p className="subHead-text-learner mb-4 text-uppercase mt-5">
              AUTHENTICATION OPTIONS
            </p>
            <p className="subText text-capitalize mb-4">
              Enabling the following authentication methods will allow users
              within this organization to authenticate with only the method(s)
              specified.
            </p>
            <div className="">
              {
                loginTypeList.map(item => (
                  <div key={item.id} className="form-check mb-2">
                    <label className="custom-control  overflow-checkbox" >
                      <input type="checkbox" ref={addCheckBoxRef} id={item.id} onChange={(event) => { onSelectLoginType(event, item) }} className="form-check-input overflow-control-input" />
                      <span className="overflow-control-indicator"></span>
                    </label>
                    <label className="form-check-label inner-sub" htmlFor={item.id}>{item.typeNameDescription}</label>
                  </div>
                ))
              }
            </div>
          </div>
          <div className="col-6">
            <p className="subHead-text-learner mb-4 text-uppercase mt-5">
              ACCOUNT LOCKOUT
            </p>
            <div className="">
              {
                accountLockoutOptions?.length > 0 && accountLockoutOptions.map(obj => (<div key={obj.id} className="form-check mb-2">
                  <label className="custom-control overflow-checkbox">
                    <input type="checkbox" id={obj.id + 'lock'} className="form-check-input overflow-control-input" onChange={(e) => { onChangeAccountLockout(e, obj) }} />
                    <span className="overflow-control-indicator"></span>
                  </label>
                  <label className="form-check-label inner-sub" htmlFor="exampleCheck1">{obj.accountLockoutOptions}</label>
                </div>))
              }


            </div>
            <p className="subHead-text-learner mb-4 text-uppercase mt-5">
              GEO BLOCKING
            </p>
            <div>
              {
                geoBlockingOptions?.length > 0 && geoBlockingOptions.map(item => (
                  <div key={item.id} onChange={() => onChangeGeoBlock(item)}>
                    <input type="radio" name="geoblock" id={item.id} value={item.id}
                      {...register("geoBlockId")}

                    />
                    <label htmlFor={item.id} className="radio inner-sub">{item.geoBlockingOptions}</label></div>
                ))
              }


            </div>
            <div className='d-flex'>
              <div><p className="subHead-text-learner mb-4 text-uppercase mt-5">
                GEO BLOCKING EXCEPTIONS
              </p></div>
              <div className="d-flex ml-auto">
                <span
                  className="material-icons mr-0 add-icon-grp ml-auto cursor-text">
                  add
                </span>
                <p className="subText add-geo-icon add-exception-text pt-1 ml-2 cursor-text">
                  Add Exception
                </p>
              </div>
              {/* <div className='ml-auto' disabled={true}> 
                <span className="material-icons badge-icons mr-0 add-icon add-geo-icon ml-auto">add</span>
              </div> */}
            </div>
            <div className="form-outline geo-body w-100" disabled={true}>
              <textarea className="form-control mb-2" id="geo_exceptions" rows="4" placeholder="No exceptions have been defined" name="geo_exceptions"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganizationSecurity
