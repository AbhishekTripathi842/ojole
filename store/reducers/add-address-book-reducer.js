import {
  ADD_ADDRESS_BOOK,
  ADD_ADDRESS_BOOK_ERROR,
  ADD_ADDRESS_BOOK_SUCCESS,
} from "../type";

const initialState = {
  response: {},
  message: "",
  loading: false,
  error: false,
  success: false,
  errorMessage: "",
};
export const AddAddressBookReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ADDRESS_BOOK_SUCCESS:
      return {
        ...state,
        message: action.payload.message,
        response: action.payload.response,
        success: action.payload.success,
      };
    case ADD_ADDRESS_BOOK:
      return {
        ...state,
        loading: true,
      };
    case ADD_ADDRESS_BOOK_ERROR:
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
