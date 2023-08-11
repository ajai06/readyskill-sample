import React, { useEffect, useState, useRef } from "react";

import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import {CopyToClipboard} from 'react-copy-to-clipboard';

// import { inviteCodeGenerate } from "../../../../services/apiServices";

import { inviteCodeGenerate } from "../../../../services/organizationServices";


import { useToastDispatch } from "../../../../context/toast/toastContext";

import "./inviteCodeGenerate.scss";

const InviteCodeGenerate =React.memo(({organizationData}) => {


  const { register, setValue, getValues, watch } = useForm();

  const location = useLocation();

  
  const toast = useToastDispatch();

  const [organization, setOrganization] = useState([]);
  const [organizationType, setOrganizationType] = useState('');

  const mountedRef = useRef(false);

    useEffect(() => {
        mountedRef.current = true;
        if(mountedRef){
          setOrganization(organizationData);
          setOrganizationType(organizationData.organizationTypeInfo.type)
          generateNewCode();
        }
        return () => {
            mountedRef.current = false
        }
    }, []);

  const generateNewCode = () => {
      
        
      inviteCodeGenerate(location.state.organization.id)
      .then(res => {
        setTimeout(() => {
          
          if(mountedRef){
            setValue("inviteCode", res.data.inviteCode)
          }
        }, 500);
      })
      .catch(err=>{
        console.log(err.response);
      })
  }

  const value = watch("inviteCode");
  
  useEffect(() => {
    if(mountedRef){
      setCopyValue(value)
    }
  }, [value]);

  const [ copyValue, setCopyValue ] = useState('');

  const onCopy = () => {
    const value = getValues("inviteCode");
    if(mountedRef){
      setCopyValue(value);
      toast({type:"success", text : "Copied", timeout: 3000})
    }
  }

  const [inviteCodeShown, setPasswordShown] = React.useState(false);
    const toggleInviteCodeVisiblity = () => {
        setPasswordShown(!inviteCodeShown);
    };


  return (

    
    <div className="invite-form-container">

      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-8 col-lg-8 col-md-8 p-0 mb-4">
            <div className="card shadow mb-4 invite-card">
              <div className="card-header">
                <div className="card-body">
                  <form>
                    <div className="row mb-3">
                      <div className="col">
                        <div className="form-outline mt-1">
                          <div className="text3">{organization.organizationName}</div>
                          <div className="subText">{organizationType}</div>
                          <div className="subText text-capitalize">{organization.serviceAddress}</div>
                        </div>
                      </div>

                      <div className="col m-auto">
                        <div className="form-outline code-pass">
                          <label className="form-label subText" htmlFor="invite-code">
                            Organization Invite Code
                          </label>
                          <div className="refresh-code">
                              <input type={inviteCodeShown ? "text" : "password"} id="inviteCode" className="form-control mb-2 mr-3" 
                                     {...register("inviteCode")}/>
                              <span className="material-icons eye-icon" onClick={toggleInviteCodeVisiblity}>
                                {inviteCodeShown ? 'visibility_off' : 'visibility'}
                            </span>

                              
                            <span onClick={generateNewCode} className="material-icons ml-3 refresh-icon custom-tooltip" 
                              >
                                    <span className='tooltiptext'>Click here to generate</span>
                                    replay_circle_filled</span>
                            <CopyToClipboard text={copyValue} onCopy={onCopy}>
                                <span  className="material-icons refresh-icon custom-tooltip" 
                                  >
                                    <span className='tooltiptext'>Click here to copy</span>
                                    content_copy</span>  
                            </CopyToClipboard>
                              
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
})

export default React.memo(InviteCodeGenerate);
