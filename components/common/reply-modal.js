import { useEffect, useReducer, useState } from "react";
import { Modal } from "react-bootstrap";
import { replyECardPickupItem } from "../../api/CardPickupAPI";
import { useAPIRequestWithPayload } from "../../shared/api-request-hook";
import { initalState, reducer } from "../../shared/default-reducer";

const ReplyModal = ({ id, showModal, handleClose ,setLoading }) => {
  const [message, setMessage] = useState("");
  const [state, dispatch] = useReducer(reducer, initalState);
  const [invokeReply] = useAPIRequestWithPayload(
    dispatch,
    replyECardPickupItem
  );

  useEffect(() => {
    if (state.success) {
      setMessage("");
      closeModal(true);
      setLoading(false)
    }
  }, [state]);

  function handleSubmit(event) {
    event.preventDefault();
    setLoading(true)

    if (!id) return;
    if (!message) return;

    let data = {
      ecardsent_recipient_id: parseInt(id),
      message: message,
    };

    invokeReply(data);
  }

  function closeModal(result) {
    setMessage("");
    dispatch({});
    handleClose(result);
  }

  return (
    <Modal
      show={showModal}
      onHide={() => closeModal(false)}
      className="reply-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>WRITE A REPLY</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="reply-body">
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="write here..."
              ></textarea>
            </div>

            <div className="button-container">
              <button type="submit" disabled={state.loading}>
                Send Reply
              </button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default ReplyModal;
