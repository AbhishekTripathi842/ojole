import Cookies from "universal-cookie";
import axios, { CancelToken } from "axios";
import { API_URL } from "../store/type";

export function getCardsList(params, cancelToken) {
  const url = new URL(`${API_URL}api/product/cards`);
  for (var p in params) {
    url.searchParams.append(p, params[p]);
  }
  return axios.get(url.href, {
    cancelToken: cancelToken,
  });
}

export function getPopularCardsList(params, cancelToken) {
  const url = new URL(`${API_URL}api/product/cards/popular`);
  for (var p in params) {
    url.searchParams.append(p, params[p]);
  }
  return axios.get(url.href, {
    cancelToken: cancelToken,
  });
}

export function getPremiumCardsList(params, cancelToken) {
  const url = new URL(`${API_URL}api/product/cards/private`);
  for (var p in params) {
    url.searchParams.append(p, params[p]);
  }
  return axios.get(url.href, {
    cancelToken: cancelToken,
  });
}

export function getFreeCardsList(params, cancelToken) {
  const url = new URL(`${API_URL}api/product/cards/free`);
  for (var p in params) {
    url.searchParams.append(p, params[p]);
  }
  return axios.get(url.href, {
    cancelToken: cancelToken,
  });
}
