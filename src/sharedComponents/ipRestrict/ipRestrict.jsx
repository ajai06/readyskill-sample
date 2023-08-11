import React from 'react';
import './ipRestrict.scss'

const IpRestrictModal = React.memo(({ipError, setIpError}) => {

    return (
        <div className="ipRestrict-modal">
            <div
              className={`modal ${ipError ?  'modal-show' : 'modal-hide'}`}
              id="ipBlocked-modal"
              tabIndex="-1"
              aria-labelledby="delete-modal"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="subHead-text-learner modal-title h4 ml-2" id="ipBlocked-modalLabel">
                      IP Restricted
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={()=>setIpError(false)}
                    >
                    </button>
                  </div>
                  <div className="modal-body text-center p-5">
                    <div className="d-flex justify-content-center">
                      <span className="material-icons error-icon mr-0">error</span>
                      <h5 className="ml-2 text-white">
                        Ouch! Your IP has been restricted.
                      </h5>
                    </div>
                    <p className="subText mt-4">
                        We have detected too many attempts to enter an invalid
                        invite code. Because we take security of our platform
                        very seriously we have to put you in timeout. You'll
                        have to stay here a while but we will let you back out
                        and you can try to redeem an invite code at that time.
                        In the meantime, we suggest you contact your
                        organization administrator to straighten out the issue
                      </p>
                  </div>
                </div>
              </div>
            </div>
        </div>
    )
})

export default React.memo(IpRestrictModal)
