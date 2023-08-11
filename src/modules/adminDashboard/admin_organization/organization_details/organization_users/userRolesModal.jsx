import React, { useEffect, useState } from 'react'
import { Modal, CloseButton } from "react-bootstrap";

import { getActiveRolesOfUser } from '../../../../../services/organizationServices';

function UserRolesModal({ onHide, userInfo, ...props }) {

    const [loading, setLoading] = useState(false);
    const [activeRoles, setActiveRoles] = useState([]);
    const [inActiveRoles, setInActiveRoles] = useState([]);

    useEffect(() => {
        setLoading(true);
        getActiveRolesOfUser(userInfo.id)
            .then(res => {
                setLoading(false);
                setActiveRoles(res.data.filter(role => role.isActive));
                setInActiveRoles(res.data.filter(role => !role.isActive));

            })
            .catch(err => {
                console.log(err.response)
            })
    }, [])



    return (
        <>
            <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" className={`manage-groups-modal ${loading ? 'z-indexx ' : ''}`}>
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter" className='subHead-text-learner h-1'>
                        Roles
                    </Modal.Title>
                    <CloseButton onClick={onHide} />
                </Modal.Header>
                <Modal.Body>

                    <ul style={{ listStyleType: 'none' }}>
                        <li className='subHead-text-learner'>
                            Assigned Roles
                            <ul className='my-2'>
                                {
                                    activeRoles && activeRoles.length > 0
                                        ? activeRoles.map(item => (
                                            <li key={item.id} className='text-white'>{item.roleName}</li>
                                        ))
                                        : <li className='text-white'>No assigned roles found</li>
                                }
                            </ul>
                        </li>
                        <li className='subHead-text-learner'>
                            Denied Roles
                            <ul className='my-2'>
                                {
                                    inActiveRoles && inActiveRoles.length > 0
                                    ? inActiveRoles.map(item => (
                                        <li key={item.id} className='text-white'>{item.roleName}</li>
                                    ))
                                    : <li className='text-white'>No denied roles found</li>
                                }
                            </ul>
                        </li>
                    </ul>

                </Modal.Body>
                <Modal.Footer>
                    <a className="close-modal-btn" onClick={onHide}>
                        Close
                    </a>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default UserRolesModal