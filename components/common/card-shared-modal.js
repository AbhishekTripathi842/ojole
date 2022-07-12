import { Modal } from "react-bootstrap";
const CardSharedModal = ({ showModal, handleClose }) => {
  return (
    <Modal show={showModal} onHide={handleClose} className="card-shared-modal">
      <Modal.Header closeButton>
        <Modal.Title>Your card has been shared.</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <div className="card-shared-body">
            <form>
              <p>You can find your card in <span>card history</span>. <br />
              <span className="span-2">You can share or send more when closing this window.</span></p>
              <div className="button-container">
                <button>CLOSE</button>
              </div>

            </form>
          </div>
      </Modal.Body>
    </Modal>
  );
};
export default CardSharedModal;
