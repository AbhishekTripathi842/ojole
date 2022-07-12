import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { LoginAction } from "../../store/actions/login-action";
import validator from "validator";
import LoadingScreen from "../../components/common/loader";

import {
  FORGOTPASSWORD_MODAL_OPEN,
  LOGIN_INITIAL,
  LOGIN_MODAL_CLOSE,
  REGISTER_MODAL_OPEN,
} from "../../store/type";
import reactSelect from "react-select";

const LoginModal = ({ dispatch, showModal, loginResponse, loginModal,state }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

useEffect(()=>{
},[loading]);
useEffect(() => { 
  setLoading(false)
}, [loginResponse]);

  const ResetState = () => {
    setEmail("");
    setPassword("");
    setErrors("");
  };
  useEffect(() => {
    if (loginResponse.success) {
      dispatch({ type: LOGIN_MODAL_CLOSE });
      // closeModal();
      // window.alert("You have login successful!")
      // if (confirm("You have login successful!")) router.push("/");
    }
    // setEmail("");
    // setPassword("");
    // loginResponse.errorMessage = "";
  }, [loginResponse]);

  useEffect(() => {
    if (showModal) {
      ResetState();
      dispatch({ type: LOGIN_INITIAL });
    }
  }, [showModal]);

  const LoginApi = async (e) => {
    e.preventDefault();

    // if (email !== "" && password !== "") {
    if (CheckEmail()) {
      setErrors({});
      setLoading(true)
      let formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      await dispatch(LoginAction(formData));
    }
    // }
  };

  const CheckEmail = () => {
    if (!validator.isEmail(email)) {
      setErrors({ email: "Invalid Email" });
      return false;
    } else {
      setErrors({});
      return true;
    }
  };

  function handleChange(event) {
    if (loginResponse.error) {
      dispatch({ type: LOGIN_INITIAL });
    }

    if (errors.email) {
      setErrors({});
    }

    if (event.target.name == "email") {
      setEmail(event.target.value);
    } else if (event.target.name == "password") {
      setPassword(event.target.value);
    }
  }

  function closeModal() {
    ResetState();
    dispatch({ type: LOGIN_INITIAL });
    dispatch({ type: LOGIN_MODAL_CLOSE, payload: { email: "" } });
  }

  return (
    <React.Fragment>
    <Modal
      show={loginModal.modal_open}
      onHide={closeModal}
      className="login-modal"
      onExited={() => ResetState()}
    >
      <Modal.Header closeButton>
        <Modal.Title>Welcome back, please login to your account</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      {loginResponse.errorMessage !== "" ? (
              <p className="error-style-p">
                {loginResponse.errorMessage === "Invalid credentials!"
                  ? "Wrong Credentials! Please try again."
                  : loginResponse.errorMessage ===
                    "Need To Verify Email Address"
                  ? "Need To Verify Email Address"
                  : null}
              </p>
            ) : null}
        <div className="login-body">
          <form onSubmit={(e) => LoginApi(e)}>
            <div className="input-container mb-4">
              <p>Email<span className="required">*</span></p>
              <input
                type="email"
                name="email"
                placeholder="example@email.com"
                value={email}
                onChange={handleChange}
                required
              ></input>
              {errors.email ? (
                <p className="error-style-p">{errors.email}</p>
              ) : null}
              {loginResponse.errors ? (
                <p className="error-style-p">{loginResponse.errors.email}</p>
              ) : null}
            </div>
            <div className="input-container mb-4">
              <p>Password<span className="required">*</span></p>
              <input
                type="password"
                name="password"
                placeholder="Write here..."
                value={password}
                onChange={handleChange}
                required
              ></input>
            </div>
            <div className="forgotpassword-container">
              <p>
                <a
                  href="#"
                  onClick={() => {
                    dispatch({
                      type: FORGOTPASSWORD_MODAL_OPEN,
                      payload: { email: email },
                    });
                    dispatch({ type: LOGIN_MODAL_CLOSE });
                  }}
                >
                  Forgot password?
                </a>
              </p>
            </div>
            <button type="submit">LOGIN</button>
      
            <p className="terms-text">
              By creating an account, I agree with
              <span className="terms-textbold">
                {" "}
                <a target="_blank" href="/terms-conditions">Ojolie's Terms of Service</a>{" "}
              </span>
              and <span className="terms-textbold"> <a target="_blank" href="/privacy-policy"> Privacy Policy.</a></span>
            </p>
            <p className="register-button mb-5">
              Don’t have an account?{" "}
              <a
                href="#"
                onClick={() => {
                  dispatch({ type: REGISTER_MODAL_OPEN });
                  dispatch({ type: LOGIN_MODAL_CLOSE });
                }}
              >
                Sign Up
              </a>
            </p>
          </form>
        </div>
      </Modal.Body>
      
    </Modal>
    {loading  ? 
      <LoadingScreen></LoadingScreen> :''
     }
     </React.Fragment>
  );
};
export default connect((state) => ({
  loginResponse: state.loginResponse,
  loginModal: state.loginModal,
  registerModal: state.registerModal,
  forgotpasswordModal: state.forgotpasswordModal,
  state:state
}))(LoginModal);
