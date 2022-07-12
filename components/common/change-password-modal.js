import { useEffect, useReducer, useState } from "react";
import { Modal } from "react-bootstrap";
import validator from "validator";
import { reducer, initalState } from "../../shared/default-reducer";
import { changePassword } from "../../api/AccountAPI";
import { useAPIRequestWithPayload } from "../../shared/api-request-hook";

const initialFormState = {
  current_password: "",
  new_password: "",
  confirm_password: "",
};

const ChangePasswordModal = ({ showModal, handleClose }) => {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [state, dispatch] = useReducer(reducer, initalState);
  const [invokeChangePassword] = useAPIRequestWithPayload(
    dispatch,
    changePassword
  );

  useEffect(() => {
    if (state.success) {
      hideModal();
    }
  }, [state]);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  function hangleSubmit(event) {
    event.preventDefault();
    dispatch({});

    let errors = {};

    if (validator.isEmpty(form.current_password)) {
      errors.current_password = "Invalid current password.";
    }

    if (!validator.isLength(form.new_password, { min: 6 })) {
      errors.new_password = "Invalid new password.";
    }

    if (!validator.equals(form.new_password, form.confirm_password)) {
      errors.confirm_password = "Passwords not match.";
    }

    setErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    dispatch({ type: "loading" });

    let data = {
      current_password: form.current_password,
      password: form.new_password,
      password_confirmation: form.new_password,
    };

    invokeChangePassword(data);
  }

  function hideModal() {
    dispatch({});
    setForm(initialFormState);
    setErrors({});
    handleClose();
  }

  return (
    <Modal
      show={showModal}
      onHide={hideModal}
      className="change-password-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Change Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* {state.error && <p className="error-style-p">{state.message}</p>} */}
        {state.error && <p className="error-style-p">please enter valid Current Password</p>}
        <div className="change-password-body">
          <form onSubmit={hangleSubmit}>
            <div className="input-container mb-4">
              <p>Current Password</p>
              <input
                type="password"
                name="current_password"
                value={form.current_password}
                onChange={handleChange}
                placeholder=" "
              ></input>
              {errors.current_password && (
                <p className="error-style-p">{errors.current_password}</p>
              )}
            </div>
            <div className="input-container mb-4">
              <p>New Password</p>
              <input
                type="password"
                name="new_password"
                value={form.new_password}
                onChange={handleChange}
                placeholder=" "
              ></input>
              {errors.new_password && (
                <p className="error-style-p">{errors.new_password}</p>
              )}
            </div>
            <div className="input-container mb-5">
              <p>Confirm New Password</p>
              <input
                type="password"
                name="confirm_password"
                value={form.confirm_password}
                onChange={handleChange}
                placeholder=" "
              ></input>
              {errors.confirm_password && (
                <p className="error-style-p">{errors.confirm_password}</p>
              )}
            </div>

            <button type="submit">Change password</button>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default ChangePasswordModal;
