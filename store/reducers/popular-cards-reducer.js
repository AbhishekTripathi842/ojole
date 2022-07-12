import {
  POPULAR_CARDS,
  POPULAR_CARDS_ERROR,
  POPULAR_CARDS_SUCCESS,
} from "../type";

const initialState = {
  response: {},
  message: "",
  loading: false,
  error: false,
  success: false,
  errorMessage: "",
};
export const PopularCardListReducer = (state = initialState, action) => {
  switch (action.type) {
    case POPULAR_CARDS_SUCCESS:
      return {
        ...state,
        message: action.payload.message,
        response: action.payload.response,
        success: action.payload.success,
      };
    case POPULAR_CARDS:
      return {
        ...state,
        loading: true,
      };
    case POPULAR_CARDS_ERROR:
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
