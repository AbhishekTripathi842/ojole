import "../styles/globals.css";
import "../styles/style-1.css";
import "../styles/style2.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-multi-carousel/lib/styles.css";
import "react-calendar/dist/Calendar.css";
import { loadStripe } from '@stripe/stripe-js/pure';
import { Elements } from '@stripe/react-stripe-js';

// import { wrapper } from "../store/store";
import React from "react";
import App from "next/app";
import { ConnectedRouter } from "connected-next-router";
import { Provider } from "react-redux";
import store from "../store/store";
import { createWrapper } from "next-redux-wrapper";
import LoginModal from "../components/common/login-modal";
import ForgotPasswordModal from "../components/common/forgot-password-modal";
import RegisterModal from "../components/common/register-modal";

const stripePromise = loadStripe('pk_test_51K2wD2GCGkCKrL1A5qqr8EejdY3qFwVGbwsORyrEmsjzzpo9E1BYvP2aZbwdVzPjwEEPeR9Pua3iup87wceiGgGY00LRDotwBg');

class OjolieApp extends App {
  render() {
    //Information that was returned  from 'getInitialProps' are stored in the props i.e. pageProps
    
    const { Component, pageProps } = this.props;
    return (
      <Provider store={store}>
        <Elements stripe={stripePromise}>
        <Component {...pageProps} />
        <LoginModal />
        <ForgotPasswordModal />
        <RegisterModal />
        </Elements>
      </Provider>
      // <AuthProvider authenticated={authenticated}>
      //   <Component {...pageProps} />
      // </AuthProvider>
    );
  }
}

const makeStore = () => store;
const wrapper = createWrapper(makeStore);

export default wrapper.withRedux(OjolieApp);
