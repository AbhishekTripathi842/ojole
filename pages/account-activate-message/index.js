import React from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "../../components/common/header";
import Meta from "../../components/common/meta";
import Image from "next/image";
import { useState } from "react";
import LoginModal from "../../components/common/login-modal";
import FooterComponent from "../../components/common/footer";
import AuthenticatedRoute from "../../components/authenticateRoute";

const AccountActivateMessagePage = () => {
  const [loginModal, setLoginModal] = useState(false);
  const [token, setToken] = useState("");
  return (
    <main>
      <LoginModal
        showModal={loginModal}
        handleClose={() => setLoginModal(false)}
      />

      <Head>
        <title>Account activation</title>
        <Meta />
      </Head>
      <Header tokenData={(data)=>setToken(data)} />

      <div className="activate-message-page-wrapper">
        <div className="activate-message-section">
          <h1>Congratulations!</h1>
          <p>You have successfully activated your account.</p>
          <button onClick={() => setLoginModal(true)}>
            Login to my account
          </button>
          <img src="/assets/image/hand-with-heart.svg" />
        </div>
        <div className="guarantee-section">
          <h1>Full 30 Day Money Back Guarantee</h1>
          <p>
            We offer a full 30 day money back guarantee <br />- so try a paid
            membership now for unlimited sending of all our cards!{" "}
          </p>
        </div>
      </div>
      <FooterComponent />
    </main>
  );
};

export default AuthenticatedRoute(AccountActivateMessagePage);
