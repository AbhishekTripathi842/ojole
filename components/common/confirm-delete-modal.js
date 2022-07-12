import { Modal } from "react-bootstrap";
const ConfirmDeleteModal = ({ showModal, handleClose }) => {
  return (
    <Modal show={showModal} onHide={handleClose} className="confirm-delete-modal">
      <Modal.Header closeButton>
        <Modal.Title>Are you sure you want to delete 22 contacts permanently?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <div className="confirm-delete-body">
            <form>
        
              <div className="button-container">
                <button className="button-outline">CANCEl</button>
                <button>DELETE</button>
              </div>

            </form>
          </div>
          
      </Modal.Body>
    </Modal>
  );
};
export default ConfirmDeleteModal;
