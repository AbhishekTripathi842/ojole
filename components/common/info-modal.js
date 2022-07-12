import { Modal } from "react-bootstrap";
const InfoModal = ({ showModal, handleClose }) => {
  return (
    <Modal show={showModal} onHide={handleClose} className="info-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          <img src="/assets/image/done-icon.svg" />
          Your card has been scheduled!
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <div className="info-body">
            
          <p>You will receive a confirmation email once it has been sent. <br />
          Please check your email or card history for confirmation.</p>
          <div className="button-container">
              <button>Continue browsing</button>
          </div>
           
      </div>
      </Modal.Body>
    </Modal>
  );
};
export default InfoModal;
