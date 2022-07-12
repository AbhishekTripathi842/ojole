import Cookies from "universal-cookie";
import axios from "axios";
import { API_URL } from "../store/type";

const cookies = new Cookies();
/**
 *
 * @param params (type => sent | draft | received), page
 * @param cancelToken axio cancel token
 */
export function getECardSentItems(params, cancelToken) { 
  return axios.get(
    `${API_URL}api/product/ecardsentitems?type=${params.type}&page=${params.page}&filter=${params.filter}`,
    {
      cancelToken: cancelToken,
      headers: { Authorization: `Bearer ${cookies.get("token")}` },
    }
  );
}

export function deleteECardSentItem(id, cancelToken) {
  return axios.get(`${API_URL}api/product/sentcard/delete/${id}`, {
    cancelToken: cancelToken,
    headers: { Authorization: `Bearer ${cookies.get("token")}` },
  });
}


export function shareCountUpdate(data, cancelToken){
  console.log('shareCountUpdate')
  console.log(data)
  return axios.post(
    `${API_URL}api/product/sentcard/update-share-count`,data,
    {
      cancelToken: cancelToken,
      headers: { Authorization: `Bearer ${cookies.get("token")}` },
    }
  );  
}