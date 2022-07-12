import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { RegisterAction } from "../../store/actions/register-action";
import validator from "validator";
import { LOGIN_MODAL_OPEN, REGISTER_MODAL_CLOSE } from "../../store/type";
import LoadingScreen from "../../components/common/loader";
import Link from "next/link";

const RegisterModal = ({
  showModal,
  dispatch,
  registerModal,
  registerResponse,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [subscribe, setSubscribe] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const ResetState = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setErrors("");
    registerResponse.success = "";
  };

  useEffect(() => {
    setEmail(registerModal.email);
    console.log("email ", registerModal.email);
  }, []);

  useEffect(()=>{
     
      console.log(loading)
  },[loading]);

  useEffect(() => { 
    setLoading(false)
  }, [registerResponse]);

  useEffect(() => {
    if (registerResponse.success) {
      ResetState();    
      dispatch({ type: REGISTER_MODAL_CLOSE });
    }
    ResetState();
    registerResponse.errors = "";
  }, [registerResponse.response]);

  useEffect(() => {
    if (showModal) {
      ResetState();
    }
  }, [showModal]);

  const RegisterApi = async (e) => {
    e.preventDefault();
    if ( validateSubmitForm()) {
      setLoading(true)
      let formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("password_confirmation", confirmPassword);
      formData.append("subscription_type", 101);
      formData.append("newsletter_subscribed", subscribe);

      await dispatch(RegisterAction(formData));
    }
  };

  const chackPassword = () =>{

    return true;
  }
  const validateSubmitForm = () =>{ 
 
    setErrors({});     
    let errorStatus = false;
    let errForm={};
    let cvv_regex = /^[0-9]{3,4}$/;
    let card_len_regex = /^[0-9]{15,16}$/;

    if(firstName ==''){
      errForm.first_name='The first name field is required.';       
      errorStatus  = true
    }
    if(lastName ==''){
      errForm.last_name='The last name field is required.';     
      errorStatus  = true
    }
    if(email === undefined || email ==''){ 
      errForm.email='The email field is required.';     
      errorStatus  = true
    }
    else if (!validator.isEmail(email)) {
      errForm.email='Please provide a valid email.';     
      errorStatus  = true
    }    
    if(password ==''){
      errForm.password='The password field is required.';     
      errorStatus  = true
    }
    if(confirmPassword==''){
      errForm.password_confirmation='The confirm password field is required.';     
      errorStatus  = true
    }else if(password!==confirmPassword){
      errForm.password_confirmation='The password and confirm password do not match.';     
      errorStatus  = true
    }

    if(errorStatus){
      setErrors(errForm);
      return false;
    }  
    setErrors({});
    return true;
  
  }

  const CheckEmail = () => {
    if (!validator.isEmail(email)) {
      setErrors({ ...errors, email: "Invalid Email" });
      return false;
    } else {
      setErrors({});
      return true;
    }
  };

  return (
    
    <Modal
      show={registerModal.register_modal_open}
      onHide={() => {
        dispatch({ type: REGISTER_MODAL_CLOSE });
        ResetState();
        registerResponse.errors = "";
      }}
      onEntered={()=>setEmail(registerModal.email)}
      className="register-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Register to send our free cards.</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="register-body">
          <form onSubmit={RegisterApi}>
          <div className="input-container mb-4">
              <p>First Name <span className="required">*</span></p>
              <input
                type="text"
                placeholder="Write here..."
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                
              ></input>
              {errors.first_name ? (
                <p className="error-style-p">{errors.first_name}</p>
              ) : null}              
              {registerResponse.errors ? (
                <p className="error-style-p">
                  {registerResponse.errors.first_name}
                </p>
              ) : null}
            </div>
            <div className="input-container mb-4">
              <p>Last Name <span className="required">*</span></p>
              <input
                type="text"
                placeholder="Write here..."
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              ></input>
              {errors.last_name ? (
                <p className="error-style-p">{errors.last_name}</p>
              ) : null}  
              {registerResponse.errors ? (
                <p className="error-style-p">
                  {registerResponse.errors.last_name}
                </p>
              ) : null}
            </div>
            <div className="input-container mb-4">
              <p>Email <span className="required">*</span></p>
              <input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
              {errors.email ? (
                <p className="error-style-p">{errors.email}</p>
              ) : null}
              {registerResponse.errors ? (
                <p className="error-style-p">{registerResponse.errors.email}</p>
              ) : null}
            </div>
            <div className="input-container mb-4">
              <p>Password <span className="required">*</span></p>
              <input
                type="password"
                placeholder="Write here..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></input>
              {errors.password ? (
                <p className="error-style-p">{errors.password}</p>
              ) : null}              
            </div>
            <div className="input-container mb-4">
              <p>Confirm Password <span className="required">*</span></p>
              <input
                type="password"
                placeholder="Write here..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></input>
              {errors.password_confirmation ? (
                <p className="error-style-p">{errors.password_confirmation}</p>
              ) : null}
              {registerResponse.errors ? (
                <p className="error-style-p">
                  {registerResponse.errors.password}
                </p>
              ) : null}
            </div>
            <div className="input-container mb-3">
              <label>
                <input
                  type="checkbox"
                  checked={subscribe == 1}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSubscribe(1);
                    } else {
                      setSubscribe(0);
                    }
                  }}
                ></input>
                <span></span>
                <p>
                  Be the first to hear about special offers and news.
                  Unsubscribe anytime.
                </p>
              </label>
            </div>
            <button type="submit">Create Account</button>
            {/* {registerResponse.errorMessage !== "" ? (
              <p className="error-style-p">{registerResponse.errorMessage}</p>
            ) : null} */}
            <p className="terms-text">
              By creating an account, I agree with
              <span className="terms-textbold">
                
                  {" "}
                  <a target="_blank" href="/terms-conditions">Ojolie's Terms of Service</a>{" "}
                
              </span>
              and <span className="terms-textbold"><a target="_blank" href="/privacy-policy"> Privacy Policy.</a></span>
            </p>
            <p className="login-button mb-5">
              Have an account?{" "}
              <a
                href="#"
                onClick={() => {
                  dispatch({ type: LOGIN_MODAL_OPEN, payload: { email: "" } });
                  dispatch({ type: REGISTER_MODAL_CLOSE });
                }}
              >
                Login.
              </a>
            </p>
          </form>
        </div>
      </Modal.Body>
      {loading  ? 
       <LoadingScreen></LoadingScreen> :''
      }
    </Modal>
  );
};
export default connect((state) => ({
  registerResponse: state.registerResponse,
  registerModal: state.registerModal,
}))(RegisterModal);
