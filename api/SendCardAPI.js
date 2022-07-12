import Cookies from "universal-cookie";
import axios from "axios";
import { API_URL } from "../store/type";
import swal from 'sweetalert';

const cookies = new Cookies();

/**
 *
 * @param data body data
 * @param cancelToken axios cancel token
 */
export function createDraftSendCard(data, cancelToken,showMsg=true) { //alert(showMsg)
  if(showMsg){
    return axios.post(`${API_URL}api/product/sentcard/draft`, data, {
      cancelToken: cancelToken,
      headers: { Authorization: `Bearer ${cookies.get("token")}` },
    }).then(swal("Card saved successfully"));
  }else{
    return axios.post(`${API_URL}api/product/sentcard/draft`, data, {
      cancelToken: cancelToken,
      headers: { Authorization: `Bearer ${cookies.get("token")}` },
    });
  }

}

/**
 *
 * @param data body data
 * @param cancelToken axios cancel token
 */
export function updateDraftSendCard(data, cancelToken) {
  return axios.put(
    `${API_URL}api/product/sentcard/draft/update/${data.id}`,
    data,
    {
      cancelToken: cancelToken,
      headers: { Authorization: `Bearer ${cookies.get("token")}` },
    }
  ).then(swal("Card saved  successfully"));
}

/**
 *
 * @param data body data
 * @param cancelToken axios cancel token
 */
export function sendECardItem(data, cancelToken) { //console.log(data)
   //return
  let authHeader = { Authorization: `Bearer ${cookies.get("token")}` };
  if (data.id && data.id > 0) {
    return axios.put(`${API_URL}api/product/ecardsentitems/${data.id}`, data, {
      cancelToken: cancelToken,
      headers: authHeader,
    });
  }
  return axios.post(`${API_URL}api/product/ecardsentitems`, data, {
    cancelToken: cancelToken,
    headers: authHeader,
  });
}
