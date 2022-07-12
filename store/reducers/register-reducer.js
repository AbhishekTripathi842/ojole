import {
  REGISTER,
  REGISTER_ERROR,
  REGISTER_SUCCESS,
} from "../type";

const initialState = {
  response: {},
  message: "",
  loading: false,
  error: false,
  success: false,
  errorMessage: "",
  errors:"",
};
export const RegisterReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_SUCCESS:
      return {
        ...state,
        message: action.payload.message,
        response: action.payload.response,
        success: action.payload.success,
      };
    case REGISTER:
      return {
        ...state,
        loading: true,
      };
    case REGISTER_ERROR:
      return {
        ...state,
        loading: false,
        errors:action.payload.errorMessage,
        error: true,
        errorMessage: action.payload.message,
        success: action.payload.success,
      };
    default:
      return state;
  }
};
