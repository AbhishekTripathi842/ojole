import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "../../components/common/header";
import Meta from "../../components/common/meta";
import Image from "next/image";
import FooterComponent from "../../components/common/footer";
import router from "next/router";

function UpgradeMessagePage() {
  const [token, setToken] = useState("");

  return (
    <main>
      <Head>
        <title>Upgrade</title>
        <Meta />
      </Head>
      <Header tokenData={(data) => setToken(data)} />

      <div className="upgrade-message-page-wrapper">
        <div className="upgrade-message-section">
          <h1>Thank you for Upgrading!</h1>
          <p>
            A confirmation email has been sent to you. <br />
            You can now use all our ecards.{" "}
          </p>
          <button onClick={() => router.push("/browse-all")}>
            Browse ecards
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
}

export default UpgradeMessagePage;
