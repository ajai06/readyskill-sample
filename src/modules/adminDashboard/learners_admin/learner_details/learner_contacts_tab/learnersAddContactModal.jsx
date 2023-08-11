import React from "react";
import { Modal, Button, CloseButton } from "react-bootstrap";
import { useForm } from "react-hook-form";

const Learnersaddcontactmodal = (
  {onHide,
  learnersList,
  clearSelectedContact,
  onSelectContact,
  onAction,
  ...props}
) => {
    const { register, handleSubmit, reset, setValue } = useForm({ mode: 'onChange'});

    const hideModal=()=>{
      setValue("contactId", "")
      onHide();
      reset();
    }
    const onSubmit=(data)=>{
      setValue("contactId", "")
      reset();
      onAction(data);
    }
 

  return (
    <Modal
    className="add-contact-modal"
      {...props}
      size="md"
      
    >
      <Modal.Header className="text-white" >
        <Modal.Title id="contained-modal-title-vcenter" className="subHead-text-learner text-uppercase">Add Contact</Modal.Title>
        <CloseButton className="text-white" onClick={hideModal}/>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex py-4">
        <label htmlFor="contacts" className="inner-head text-uppercase mr-1 mt-1">Contacts : </label> 
        <select
        className="caseworker-select w-75"
        defaultValue=""
          {...register("contactId", {
            required: true,
            onChange: (e) => onSelectContact(e.target.value),
          })}>
                             
          <option value="">Please select</option>
          
          {learnersList && learnersList.map((obj) => (
            <option
              key={obj.id}
              value={obj.id}
              className="assessment-droplist text-capitalize"
            >
              {obj.firstName} {obj.lastName}{" "}
            </option>
          ))}

        </select>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <a className="close-modal-btn" onClick={hideModal}>
          Cancel
        </a>
        <Button className="btn-primary save-btn-custom" onClick={handleSubmit(onSubmit)}>
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Learnersaddcontactmodal;
