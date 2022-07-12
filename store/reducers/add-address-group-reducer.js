import {
  ADD_ADDRESS_GROUP,
  ADD_ADDRESS_GROUP_ERROR,
  ADD_ADDRESS_GROUP_SUCCESS,
} from "../type";

const initialState = {
  response: {},
  message: "",
  loading: false,
  error: false,
  success: false,
  errorMessage: "",
};
export const AddAddressGroupReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ADDRESS_GROUP_SUCCESS:
      return {
        ...state,
        message: action.payload.message,
        response: action.payload.response,
        success: action.payload.success,
      };
    case ADD_ADDRESS_GROUP:
      return {
        ...state,
        loading: true,
      };
    case ADD_ADDRESS_GROUP_ERROR:
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
