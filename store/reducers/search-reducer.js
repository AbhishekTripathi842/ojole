import {
    SEARCH,
    SEARCH_ERROR,
    SEARCH_SUCCESS,
  } from "../type";
  
  const initialState = {
    response: {},
    message: "",
    loading: false,
    error: false,
    success: false,
    errorMessage: "",
    errors: "",
  };
  export const SearchReducer = (state = initialState, action) => {
    switch (action.type) {
      case SEARCH_SUCCESS:
        return {
          ...state,
          message: action.payload.message,
          response: action.payload.response,
          success: action.payload.success,
          errors: action.payload.errorMessage,
          errorMessage: action.payload.message,
        };
      case SEARCH:
        return {
          ...state,
          loading: true,
        };
      case SEARCH_ERROR:
        return {
          ...state,
          loading: false,
          error: true,
          errorMessage: action.payload.message,
          success: false,
          errors: action.payload.errorMessage,
        };
      default:
        return state;
    }
  };
  