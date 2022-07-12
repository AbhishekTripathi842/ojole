import Cookies from "universal-cookie";
import axios, { CancelToken } from "axios";
import { API_URL } from "../store/type";

const cookies = new Cookies();

/**
 *
 * @param {JSON} data body data (name)
 * @param {CancelToken} cancelToken axios cancel token
 */
export function createAddressGroup(data, cancelToken) {
  return axios.post(`${API_URL}api/account/addressgroups`, data, {
    cancelToken: cancelToken,
    headers: { Authorization: `Bearer ${cookies.get("token")}` },
  });
}

export function deleteAddressGroup(id, cancelToken) {
  return axios.delete(`${API_URL}api/account/addressgroups/${id}`, {
    cancelToken: cancelToken,
    headers: { Authorization: `Bearer ${cookies.get("token")}` },
  });
}

/**
 *
 * @param {JSON} data body data (fname, lname, email)
 * @param {CancelToken} cancelToken axios cancel token
 */
export function createAddressBook(data, cancelToken) {
  return axios.post(`${API_URL}api/account/addressbooks`, data, {
    cancelToken: cancelToken,
    headers: { Authorization: `Bearer ${cookies.get("token")}` },
  });
}

export function deleteAddressBook(id, cancelToken) {
  return axios.delete(`${API_URL}api/account/addressbooks/${id}`, {
    cancelToken: cancelToken,
    headers: { Authorization: `Bearer ${cookies.get("token")}` },
  });
}

export function deleteMultipleAddressBook(data, cancelToken) {
  return axios.post(`${API_URL}api/account/addressbooks/delete/multiple`,{'ids':data},{
    cancelToken: cancelToken,
    headers: { Authorization: `Bearer ${cookies.get("token")}` },
  });
}

/**
 *
 * @param {JSON} data (addressbook_id => [10, 20], addressbook_group_id)
 * @param {CancelToken} cancelToken axios cancel token
 */
export function assignToGroup(data, cancelToken) {
  return axios.put(
    `${API_URL}api/account/addressbooks/group/multiple/attach`,
    data,
    {
      cancelToken: cancelToken,
      headers: { Authorization: `Bearer ${cookies.get("token")}` },
    }
  );
}

/**
 * fetch address books by group
 *
 * @param {*} id address group id
 * @param {*} cancelToken axios cancel token
 */
export function getAddressBookByGroup(id, cancelToken) {
  return axios.get(`${API_URL}api/account/addressgroups/${id}`, {
    cancelToken: cancelToken,
    headers: { Authorization: `Bearer ${cookies.get("token")}` },
  });
}

/**
 * fetch all address books
 * @param {*} cancelToken axios cancel token
 */
export function getAddressBookList(cancelToken,search='') {
  return axios.get(`${API_URL}api/account/addressbooks?search=`+search, {
    cancelToken: cancelToken,
    headers: { Authorization: `Bearer ${cookies.get("token")}` },
  });
}

/**
 * fetch all address groups
 * @param {*} cancelToken axios cancel token
 */
export function getAddressGroupList(cancelToken) {
  return axios.get(`${API_URL}api/account/addressgroups`, {
    cancelToken: cancelToken,
    headers: { Authorization: `Bearer ${cookies.get("token")}` },
  });
}

/**
 *
 * @param {*} data {"contact_data": [...]}
 * @param {*} cancelToken axios cancel token
 */
export function importContactList(data, cancelToken) {
  return axios.post(`${API_URL}api/account/addressbooks/import/contact`, data, {
    cancelToken: cancelToken,
    headers: { Authorization: `Bearer ${cookies.get("token")}` },
  });
}
