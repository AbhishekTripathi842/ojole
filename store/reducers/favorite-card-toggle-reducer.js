import {
  FAVORITE_CARDS_TOGGLE,
  FAVORITE_CARDS_TOGGLE_ERROR,
  FAVORITE_CARDS_TOGGLE_SUCCESS,
} from "../type";

const initialState = {
  response: {},
  message: "",
  loading: false,
  error: false,
  success: false,
  errorMessage: "",
};
export const FavoriteCardToggleReducer = (state = initialState, action) => {
  switch (action.type) {
    case FAVORITE_CARDS_TOGGLE_SUCCESS:
      return {
        ...state,
        message: action.payload.message,
        response: action.payload.response,
        success: action.payload.success,
      };
    case FAVORITE_CARDS_TOGGLE:
      return {
        ...state,
        loading: true,
      };
    case FAVORITE_CARDS_TOGGLE_ERROR:
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
