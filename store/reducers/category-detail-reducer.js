import {
  CATEGORIES,
  CATEGORIES_DETAIL,
  CATEGORIES_DETAIL_ERROR,
  CATEGORIES_DETAIL_SUCCESS,
  CATEGORIES_ERROR,
  CATEGORIES_SUCCESS,
  HOLIDAY_CATEGORIES,
  HOLIDAY_CATEGORIES_ERROR,
  HOLIDAY_CATEGORIES_SUCCESS,
} from "../type";

const initialState = {
  response: {},
  message: "",
  loading: false,
  error: false,
  success: false,
  errorMessage: "",
};
export const CategoryDetailReducer = (state = initialState, action) => {
  switch (action.type) {
    case CATEGORIES_DETAIL_SUCCESS:
      return {
        ...state,
        message: action.payload.message,
        response: action.payload.response,
        success: action.payload.success,
      };
    case CATEGORIES_DETAIL:
      return {
        ...state,
        loading: true,
      };
    case CATEGORIES_DETAIL_ERROR:
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
