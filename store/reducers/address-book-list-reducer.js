import {
  ADDRESS_BOOK_LIST_SUCCESS,
  ADDRESS_BOOK_LIST,
  ADDRESS_BOOK_LIST_ERROR,
} from "../type";

const initialState = {
  response: {},
  message: "",
  loading: false,
  error: false,
  success: false,
  errorMessage: "",
};
export const AddressBookListReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADDRESS_BOOK_LIST_SUCCESS:
      return {
        ...state,
        message: action.payload.message,
        response: action.payload.response,
        success: action.payload.success,
      };
    case ADDRESS_BOOK_LIST:
      return {
        ...state,
        loading: true,
      };
    case ADDRESS_BOOK_LIST_ERROR:
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
