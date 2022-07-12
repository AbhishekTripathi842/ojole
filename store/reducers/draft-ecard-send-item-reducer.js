import {
  DRAFT_ECARD_SEND_ITEM,
  DRAFT_ECARD_SEND_ITEM_ERROR,
  DRAFT_ECARD_SEND_ITEM_SUCCESS,
} from "../type";

const initialState = {
  response: {},
  message: "",
  loading: false,
  error: false,
  success: false,
  errorMessage: "",
};
export const DraftECardSendItemReducer = (state = initialState, action) => {
  switch (action.type) {
    case DRAFT_ECARD_SEND_ITEM_SUCCESS:
      return {
        ...state,
        message: action.payload.message,
        response: action.payload.response,
        success: action.payload.success,
      };
    case DRAFT_ECARD_SEND_ITEM:
      return {
        ...state,
        loading: true,
      };
    case DRAFT_ECARD_SEND_ITEM_ERROR:
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
