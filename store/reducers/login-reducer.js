import { LOGIN, LOGIN_ERROR, LOGIN_SUCCESS, LOGIN_INITIAL } from "../type";

const initialState = {
  response: {},
  message: "",
  loading: false,
  error: false,
  success: false,
  errorMessage: "",
  errors: "",
};
export const LoginReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        message: action.payload.message,
        response: action.payload.response,
        success: action.payload.success,
      };
    case LOGIN:
      return {
        ...state,
        loading: true,
      };
    case LOGIN_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
        errorMessage: action.payload.message,
        success: action.payload.success,
        errors: action.payload.errorMessage,
      };
    case LOGIN_INITIAL:
      return initialState;
    default:
      return state;
  }
};
