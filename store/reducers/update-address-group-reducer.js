import {
  UPDATE_ADDRESS_GROUP,
  UPDATE_ADDRESS_GROUP_ERROR,
  UPDATE_ADDRESS_GROUP_SUCCESS,
} from "../type";

const initialState = {
  response: {},
  message: "",
  loading: false,
  error: false,
  success: false,
  errorMessage: "",
};
export const UpdateAddressGroupReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ADDRESS_GROUP_SUCCESS:
      return {
        ...state,
        message: action.payload.message,
        response: action.payload.response,
        success: action.payload.success,
      };
    case UPDATE_ADDRESS_GROUP:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_ADDRESS_GROUP_ERROR:
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
