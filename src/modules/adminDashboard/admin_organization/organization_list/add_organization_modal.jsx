import React, { useEffect, useState } from 'react';

import { Modal, Button, CloseButton } from "react-bootstrap";

import { useForm } from "react-hook-form";
import { State } from 'country-state-city';

import {
  getOrganization,
  addOrganization,
  updateOrganization,
  getOrganizationTypes,
  getUserNameByEmail
} from '../../../../services/organizationServices';

import { UserAuthState } from '../../../../context/user/userContext';
import { useToastDispatch } from '../../../../context/toast/toastContext';

import "../../admindashboard.scss";
import { useIsMounted } from '../../../../utils/useIsMounted';

const AddOrganizationModal = React.memo(({ onHide, fetchOrganizations, ...props }) => {

  const userState = UserAuthState();
  const toast = useToastDispatch()

  const { register, handleSubmit, watch, setError, clearErrors, getValues, formState: { errors }, reset, setValue } = useForm({ mode: 'onChange' });

  const [organizationTypes, setOrganizationTypes] = useState([]);
  // const [editMode, setEditMode] = useState(false);
  const [states, setStates] = useState([]);
  const [isNameExist, setIsNameExist] = useState(true)
  const isMounted = useIsMounted();

  useEffect(() => {

    (async () => {
      const states = State.getStatesOfCountry("US");
      await setStates(states);
      setValue("state", "OH");
      try {
        const res = await getOrganizationTypes();
        if (isMounted()) {
          setOrganizationTypes(res.data)
        }
      } catch (error) {
        console.log(error.response)
      }
    })()
  }, [props.show]);



  const handleChange = (evt) => {
    const id = evt.target.value;
    // const zip_code = (evt.target.validity.valid) ? evt.target.value : watch(id);

    const clearValue = clearNumber(id)

    if (clearValue.length >= 6) {
      let x = `${clearValue.slice(0, 5)}+${clearValue.slice(5, 9)}`;
      setValue("zip", x)
    } else {
      setValue("zip", clearValue)
    }


  }

  function clearNumber(value = '') {
    return value.replace(/\D+/g, '')
  }

  const addOrg = (data) => {

    data['clientDate'] = new Date().toString();
    data['id'] = userState.user.id;

    
    addOrganization(data)
      .then(res => {
        fetchOrganizations();
        toast({ type: "success", text: "Organization added successfully" })
        hideModal();
      })
      .catch(err => {
        console.log(err);
        toast({ type: "error", text: "Something went wrong. Please try again !" })

      })
  }

  const hideModal = () => {
    onHide();
    reset({
      organizationName: '', organizationTypeId: '', street: '', street2: '', country: '', state: '', city: '',
      administrativeUser: '', administrativeUserEmail: ''
    });
    // setEditMode(false);
  }


  const debounce = (func, delay) => {
    let debounceTimer;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer =
        setTimeout(() => func.apply(context, args), delay);
    }
  }


  const getUserName = () => {
    const values = getValues();
    let pattern = /^(([^<>()[\]\\.,;:+\s@"]+(\.[^<>()[\]\\.,;:+\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!values.administrativeUserEmail.match(pattern)) {
      setError("administrativeUserEmail", {
        type: "pattern",
      });
      return;
    } else {
      clearErrors("administrativeUserEmail")
    }
    getUserNameByEmail(values.administrativeUserEmail)
      .then((res) => {
        if (res.data) {
          setValue("administrativeUser", `${res.data.firstName} ${res.data.lastName}`);
          setIsNameExist(true);
        } else {
          setIsNameExist(false);
          setValue("administrativeUser", "");
        }

      })
      .catch(err => console.log(err))
  }

  const onOptimisedHandleChange = debounce(getUserName, 500);
  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter" className='org-add-modal'>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter" className='subHead-text-learner mt-3'>
          ADD NEW ORGANIZATION
        </Modal.Title>
        <CloseButton onClick={hideModal} className="modal-close-icon btn-light" />
      </Modal.Header>
      <Modal.Body>

        <div className='col-12 row'>
          <div className='col-6'>
          <div>
            <div className='d-flex'>
              <label className="form-label subHead-text-learner" htmlFor="org_name">Organization Name</label>
              <span className="material-icons ml-3 mt-1 info-icon edit-learner-icon text-white custom-tooltip" >
                <span className='tooltiptext'>Provide the legal name of the partner organization. This may be different than the name the organization operates under or is known within its community.</span> info</span>
            </div>
              <span className='d-flex'>
                <input {...register("organizationName", { required: true })} type="text" id="org_name" className="form-control mb-2" />
               
              </span>
              {errors.organizationName ? <span className='error-msg'>Organization name required</span> : ''}
            </div>
            <div className="">
              <div className='d-flex'>
            <label className="subHead-text-learner" htmlFor='type'>Organization Type</label>
            <span className="material-icons ml-3 mt-1 info-icon edit-learner-icon text-white custom-tooltip">
            <span className='tooltiptext'>Choose an organization type for this partner organization. The type will determine the available data and privacy settings for the organization. It cannot be changed once the organization is created.</span>info</span>
            </div>
            <span className='d-flex'>
              <select className="form-control mb-2 select-box caseworker-select" id="type" {...register("organizationTypeId", { required: true })}>
                <option value="">Please select</option>
                {
                  organizationTypes.map(org => (
                    <option key={org.id} value={org.id}>{org.type}</option>
                  ))
                }
              </select>
              
            </span>
            {errors.organizationTypeId ? <span className='error-msg'>Organization Type required</span> : ''}
          </div>
          <div className="">
            <label className="form-label subHead-text-learner" htmlFor="address">Address</label>
            <input type="text" id="address" className="form-control mb-2" {...register("address", { required: true })} />
            {
              errors.address ? <span className='error-msg'>Please enter your address</span> : ''
            }
          </div>
          <div className='d-flex'>
          <div className="">
            <label className="form-label subHead-text-learner" htmlFor="zip">ZIP Code</label>
            <div className='d-flex pr-2'>
              <span >
                <input type="text" placeholder='- - - - + - - - -' maxLength={10} pattern="[0-9]*" onInput={(event) => handleChange(event)} {...register("zip", {
                  required: true,
                  pattern: /^([0-9]{5})([+])([0-9]{4}$)/
                })}
                  id="zip" className="form-control w-100 mb-2" />
                {
                  errors.zip?.type === "required"
                    ? <span className='error-msg text-nowrap'>Zip code is required</span>
                    : errors.zip?.type === "pattern"
                      ? <span className='error-msg'>Enter valid code</span>
                      : ''
                }
              </span>
              {/* <p className='subText mx-3 mt-1'>+</p>
              <span>
                <input type="text" maxLength={4} pattern="[0-9]*" onInput={(event) => handleChange(event)} {...register("zip2", { required: true, minLength: 4 })} id="zip2" className="form-control w-100 mb-2 " />
                {
                  errors.zip2?.type === "required"
                    ? <span className='error-msg text-nowrap'>Zip plus code is required</span>
                    : errors.zip2?.type === "minLength"
                      ? <span className='error-msg'>Enter valid plus code</span>
                      : ''
                }
              </span> */}
            </div>
          </div>
          <div className=''>
            <label className="form-label subHead-text-learner" htmlFor="city">City</label>
            <input {...register("city", { required: true, pattern: /^[a-zA-Z ]*$/ })} type="text" id="city"
              className="form-control w-100 mb-2" />
            {
              errors.city?.type === "required"
                ? <span className='error-msg'>Please enter your city</span>
                : errors.city?.type === "pattern"
                  ? <span className='error-msg'>Enter your valid city name</span>
                  : ''
            }
          </div>

          <div className='pl-2'>
            <label className="form-label subHead-text-learner" htmlFor="state">State</label>

            <div className='d-flex pt-1 select_box'>
              <select id="state" defaultValue="OH" className=" form-control  text-capitalize caseworker-select select-box mb-2"
                {...register("state", { required: true })}>
                <option value="" className="caseworker-droplist text-capitalize">Select your state </option>
                {
                  states.map(state => (
                    <option key={state.isoCode} value={state.isoCode} className="caseworker-droplist text-capitalize">{state.name}</option>
                  ))
                }
              </select>
            </div>

            {
              errors.state && states.length > 0 ? <span className='error-msg'>Please select your state</span> : ''
            }
          </div>
        </div>

        </div>
          <div className='col-6'>
            <div className=''>
              <div className='d-flex'>
                <label className="form-label subHead-text-learner" htmlFor="admin_name">Organization Administrator</label>
                <span className="material-icons ml-3 mt-1 info-icon edit-learner-icon text-white custom-tooltip">info
                <span className="tooltiptext">Provide the name of the primary technical contact for this organization.This person will be added to the organization's record as the organization administrator.</span></span>
              </div>
              <input  {...register("administrativeUser", { required: true, disabled: isNameExist })} type="text" id="admin_name"
                className="form-control mb-2" />
              {
                errors.administrativeUser ? <span className='error-msg'>Name is required</span> : ''
              }
            </div>

            <div className="">
            <label className="form-label subHead-text-learner" htmlFor="admin_email">Administrator Email</label>
            <input type="email" id="admin_email" className="form-control  mb-2"
              onKeyPress={(e) => e.key === "Enter" && e.target.blur()}
              {...register("administrativeUserEmail", {
                required: true,
                pattern: /^(([^<>()[\]\\.,;:+\s@"]+(\.[^<>()[\]\\.,;:+\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                onBlur: () => onOptimisedHandleChange(),

              })}

            />
            {errors.administrativeUserEmail?.type === "required"
              ? <span className="error-msg">Administrative email required</span>
              : errors.administrativeUserEmail?.type === "pattern"
                ? <span className="error-msg">Enter valid email</span>
                : ''
            }
          </div>
          </div> 
        </div>      
      </Modal.Body>
      <Modal.Footer>
        <a className="close-modal-btn" onClick={hideModal}>
          Cancel
        </a>
        <Button onClick={handleSubmit(addOrg)} className="save-btn-custom">
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  )
})

export default React.memo(AddOrganizationModal)