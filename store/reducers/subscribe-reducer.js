import {
  SENT_MAIL,
  SENT_MAIL_ERROR,
  SENT_MAIL_SUCCESS,
  SUBSCRIBE,
  SUBSCRIBE_ERROR,
  SUBSCRIBE_SUCCESS,
} from "../type";

const initialState = {
  response: {},
  message: "",
  loading: false,
  error: false,
  success: false,
  errorMessage: "",
};
export const SubscribeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUBSCRIBE_SUCCESS:
      return {
        ...state,
        message: action.payload.message,
        response: action.payload.response,
        success: action.payload.success,
      };
    case SUBSCRIBE:
      return {
        ...state,
        loading: true,
      };
    case SUBSCRIBE_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
        errorMessage: action.payload.message,
        success: action.payload.success,
      };
    default:
      return state;
  }
};
