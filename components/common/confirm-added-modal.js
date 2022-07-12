import { Modal } from "react-bootstrap";
const ConfirmAddedModal = ({ count, showModal, handleClose }) => {
  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      className="confirm-added-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {count ?? 0} contacts have been added to your group(s).
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="confirm-added-body">
          <form>
            <div className="button-container">
              <button type="button" onClick={handleClose}>
                CLOSE
              </button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default ConfirmAddedModal;
