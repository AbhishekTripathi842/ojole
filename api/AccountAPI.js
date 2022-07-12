import Cookies from "universal-cookie";
import axios from "axios";
import { API_URL } from "../store/type";

const cookies = new Cookies();

/**
 *
 * @param data (current_password, password, password_confirmation)
 * @param cancelToken axio cancel token
 */
export function changePassword(data, cancelToken) {
  return axios.put(`${API_URL}api/account/profile/password`, data, {
    cancelToken: cancelToken,
    headers: { Authorization: `Bearer ${cookies.get("token")}` },
  });
}

/**
 *
 * @param {*} data {first_name, last_name, email, timezone, notify_sent, notify_pickup, notify_reply, newsletter_subscribed}
 * @param {*} cancelToken axio cancel token
 */
export function updateProfile(data, cancelToken) {
  return axios.put(`${API_URL}api/account/profile/all`, data, {
    cancelToken: cancelToken,
    headers: { Authorization: `Bearer ${cookies.get("token")}` },
  });
}
