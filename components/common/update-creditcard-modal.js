import { Modal } from "react-bootstrap";
const UpdateCreditcardModal = ({ showModal, handleClose }) => {
  return (
    <Modal show={showModal} onHide={handleClose} className="update-creditcard-modal">
      <Modal.Header closeButton>
        <Modal.Title>Payment method</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <div className="update-creditcard-body">
        
              <div className="input-wrapper">
                <div className="input-container">
                    <p>Name on Card</p>
                    <div className="input-with-icon">
                        <input type="text" placeholder="example@email.com"/>
                        <img src="/assets/image/name-icon.svg" />
                    </div>  
                </div>
                <div className="input-container">
                    <p>EXP Date</p>
                    <div className="input-with-icon">
                        <input type="text" placeholder="DD/MM/YY"/>
                        <img src="/assets/image/date-icon.svg" />
                    </div>  
                </div>
              </div>

              <div className="input-wrapper">
                <div className="input-container">
                    <p>Card Number</p>
                    <div className="input-with-icon">
                        <input type="text" placeholder="example@email.com"/>
                        <img src="/assets/image/card-icon.svg" />
                    </div>  
                </div>
                <div className="input-container">
                    <p>CCV</p>
                    <div className="input-with-icon">
                        <input type="text" placeholder="example@email.com"/>
                        <img src="/assets/image/lock-black-icon.svg" />
                    </div>  
                </div>
              </div>

              <div className="payment-container">
                        <img src="/assets/image/mastercard-icon.svg" />
                        <img src="/assets/image/visa-icon.svg" />
              </div>

              <div className="button-container">
                <button>+update payment info</button>
              </div>

         
          </div>
      </Modal.Body>
    </Modal>
  );
};
export default UpdateCreditcardModal;
