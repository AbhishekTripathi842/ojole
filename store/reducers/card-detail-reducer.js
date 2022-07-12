import {
  CARDS_DETAIL,
  CARDS_DETAIL_ERROR,
  CARDS_DETAIL_SUCCESS,
} from "../type";

const initialState = {
  response: {},
  message: "",
  loading: false,
  error: false,
  success: false,
  errorMessage: "",
};
export const CardDetailReducer = (state = initialState, action) => {
  switch (action.type) {
    case CARDS_DETAIL_SUCCESS:
      return {
        ...state,
        message: action.payload.message,
        response: action.payload.response,
        success: action.payload.success,
      };
    case CARDS_DETAIL:
      return {
        ...state,
        loading: true,
      };
    case CARDS_DETAIL_ERROR:
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
