import { Modal } from "react-bootstrap";
const ReplySentModal = ({ showModal, handleClose }) => {
  return (
    <Modal show={showModal} onHide={handleClose} className="reply-sent-modal">
      <Modal.Header closeButton>
        <Modal.Title>Your reply has been sent.</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="reply-sent-body">
          <div className="button-container">
            <button onClick={handleClose}>CLOSE</button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default ReplySentModal;
