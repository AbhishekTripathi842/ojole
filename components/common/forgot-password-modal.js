import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { PasswordEmailAction } from "../../store/actions/password-email-action";
import validator from "validator";
import {
  FORGOTPASSWORD_MODAL_CLOSE,
  LOGIN_MODAL_CLOSE,
  PASSWORD_EMAIL,
  PASSWORD_EMAIL_INITIAL,
} from "../../store/type";
const ForgotPasswordModal = ({
  passwordEmailResponse,
  dispatch,
  forgotpasswordModal,
}) => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [clicked, setClicked] = useState(false);
  const [changeEmail, setChangeEmail] = useState(false);
  const ForgotPasswordApi = async (e) => {
    e.preventDefault();
    if (CheckEmail()) {
      let formData = new FormData();
      formData.append("email", email);
      dispatch({
        type: PASSWORD_EMAIL,
        payload: { message: "", errorMessage: "" },
      });
      await dispatch(PasswordEmailAction(formData));
    }
  };
  const CheckEmail = () => {
    if (email === undefined || email =='') {
      setErrors({ ...errors, email: "The email field is required." });
      return false;
    }else     
    if (!validator.isEmail(email)) {
      setErrors({ ...errors, email: "Please provide a valid email." });
      return false;
    } else {
      setErrors({});
      return true;
    }
  };

  useEffect(() => {
    if(passwordEmailResponse && passwordEmailResponse.error == false){
     closeModal()
    }
   },[passwordEmailResponse])

  useEffect(() => {
    setClicked(false);
    setEmail(forgotpasswordModal.email);
  }, []);

  useEffect(() => {
    setEmail(forgotpasswordModal.email);
  }, [forgotpasswordModal.email]);

  function closeModal() {
    dispatch({ type: PASSWORD_EMAIL_INITIAL });
    setErrors({});
    setEmail("");
    dispatch({ type: FORGOTPASSWORD_MODAL_CLOSE, payload: { email: "" } });
    dispatch({ type: LOGIN_MODAL_CLOSE, payload: { email: "" } });
    passwordEmailResponse.errorMessage = "";
    passwordEmailResponse.message = "";
    setClicked(false);
  }

  useEffect(() => {
    if (passwordEmailResponse.response.code === "000") {
      setClicked(true);
      setChangeEmail(false);
    }
  }, [passwordEmailResponse.response]);
  return (
    <Modal
      show={forgotpasswordModal.forgot_modal_open}
      onHide={closeModal}
      className="forgot-password-modal"
      onExited={() => closeModal()}
    >
      <Modal.Header closeButton>
        <Modal.Title>Enter the email you used for your account.</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="forgot-password-body">
          <div className="input-container">
            <p>Email<span className="required">*</span></p>
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                // setClicked(false);
                setChangeEmail(true);
                passwordEmailResponse.errorMessage = "";
                passwordEmailResponse.message = "";
                errors.email = "";
              }}
            ></input>
            {errors.email ? (
               <p className="error-style-p">{errors.email}</p>
            ) : null}
            {passwordEmailResponse.errorMessage ? (
              <p className="error-style-p">
                {passwordEmailResponse.errorMessage}
              </p>
            ) : null}
            <p
              style={{
                color: "blue",
                marginTop: "10px",
                textAlign: "center",
              }}
            >
              {passwordEmailResponse.message}
            </p>
          </div>
          {!clicked || changeEmail ? (
            <div className="button-container">
              <button className="button-outline" onClick={closeModal}>
                CANCEl
              </button>
              <button onClick={ForgotPasswordApi}>SUBMIT</button>
            </div>
          ) : null}
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default connect((state) => ({
  passwordEmailResponse: state.passwordEmailResponse,
  forgotpasswordModal: state.forgotpasswordModal,
}))(ForgotPasswordModal);
