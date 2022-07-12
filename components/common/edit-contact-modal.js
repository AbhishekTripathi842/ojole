import { Modal } from "react-bootstrap";
const EditContactModal = ({ showModal, handleClose }) => {
  return (
    <Modal show={showModal} onHide={handleClose} className="edit-contact-modal">
      <Modal.Header closeButton>
        <Modal.Title>EDIT CONTACT</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <div className="edit-contact-body">
            <form>
              <div className="input-wrapper">
                <div className="input-container">
                  <p>Full Name</p>
                  <input type="email" placeholder="Timothy Tu"></input>
                </div>
                <div className="input-container">
                  <p>Email</p>
                  <input type="email" placeholder="timothytu@email.com"></input>
                </div>
              </div>
              <div className="button-container">
                <button className="button-outline">CANCEl</button>
                <button>SUBMIT</button>
              </div>

            </form>
          </div>
      </Modal.Body>
    </Modal>
  );
};
export default EditContactModal;
