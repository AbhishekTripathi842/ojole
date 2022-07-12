import React, { useEffect, useState } from "react";
import Router from "next/router";
import { connect, useDispatch } from "react-redux";
import Cookies from "universal-cookie";
import { LOGIN_MODAL_OPEN } from "../../store/type";

const AuthenticatedRoute = (Component = null, options = {}) => {
  function AuthenticatedRoute(props) {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    useEffect(() => {
      const cookies = new Cookies();
      const token = cookies.get("token");
      console.log("token " + token);
      if (token) {
        setLoading(false);
      } else {
        // Router.push({ pathname: "/", query: { unAuth: true } });
        Router.back();
        dispatch({ type: LOGIN_MODAL_OPEN, payload: { email: "" } });
      }
    });

    if (loading) {
      return <div />;
    }

    return <Component {...props} />;
  }

  return AuthenticatedRoute;
};

export default AuthenticatedRoute;
