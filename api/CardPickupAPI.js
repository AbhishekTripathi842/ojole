import axios from "axios";
import { API_URL } from "../store/type";

/**
 *
 * @param id ecard sent encrypted id
 * @param cancelToken axios cancel token
 */
export function getECardPickupItem(id, cancelToken) {
  return axios.get(`${API_URL}api/product/ecardpickup/${id}`, {
    cancelToken: cancelToken,
  });
}

/**
 *
 * @param data body data (ecardsent_recipient_id, message)
 * @param cancelToken axios cancel token
 */
export function replyECardPickupItem(data, cancelToken) {
  return axios.post(`${API_URL}api/product/ecardpickup/reply`, data, {
    cancelToken: cancelToken,
  });
}
