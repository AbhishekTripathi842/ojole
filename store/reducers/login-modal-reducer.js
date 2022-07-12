import {
  FORGOTPASSWORD_MODAL_CLOSE,
  FORGOTPASSWORD_MODAL_OPEN,
  LOGIN_MODAL,
  LOGIN_MODAL_CLOSE,
  LOGIN_MODAL_OPEN,
  REGISTER_MODAL,
  REGISTER_MODAL_CLOSE,
  REGISTER_MODAL_OPEN,
} from "../type";

const initialState = {
  modal_open: false,
  register_modal_open: false,
  forgot_modal_open: false,
  email: "",
};

export const LoginModalReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOGIN_MODAL_OPEN:
      return {
        ...payload,
        modal_open: true,
        email: payload.email,
      };
    case LOGIN_MODAL_CLOSE:
      return {
        ...payload,
        modal_open: false,
      };
    case LOGIN_MODAL:
      return {
        ...payload,
      };
    default:
      return state;
  }
};

export const RegisterModalReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case REGISTER_MODAL:
      return {
        ...payload,
      };
    case REGISTER_MODAL_OPEN:
      return {
        ...payload,
        register_modal_open: true,
      };
    case REGISTER_MODAL_CLOSE:
      return {
        ...payload,
        register_modal_open: false,
      };
    default:
      return state;
  }
};
export const ForgotModalReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case FORGOTPASSWORD_MODAL_OPEN:
      return {
        ...payload,
        forgot_modal_open: true,
        email: payload.email,
      };
    case FORGOTPASSWORD_MODAL_CLOSE:
      return { ...payload };
    case FORGOTPASSWORD_MODAL_CLOSE:
      return {
        ...payload,
        forgot_modal_open: false,
      };
    default:
      return state;
  }
};
