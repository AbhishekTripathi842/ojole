import { Modal } from "react-bootstrap";
const WarningModal = ({ showModal, handleClose }) => {
  return (
    <Modal show={showModal} onHide={handleClose} className="warning-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          <img src="/assets/image/warning-icon.svg" />
          You are about to delete your card draft.
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <div className="warning-body">
            
          <p>Are you sure? <br />This action cannot be undone once you click proceed.</p>
          <div className="button-container">
              <button className="button-outline">CANCEl</button>
              <button>Delete Card</button>
          </div>
           
      </div>
      </Modal.Body>
    </Modal>
  );
};
export default WarningModal;
