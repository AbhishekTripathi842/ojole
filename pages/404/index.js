import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "../../components/common/header";
import Meta from "../../components/common/meta";
import Image from "next/image";
import FooterComponent from "../../components/common/footer";
import router from "next/router";

function ErrorPage() {
  const [token, setToken] = useState("");
  return (
    <main>
      <Head>
        <title>Error</title>
        <Meta />
      </Head>
      <Header tokenData={(data)=>setToken(data)} />

      <div className="error-page-wrapper">
        <div className="error-section">
          <div className="top-section">
            <h1>Oops - something went wrong!</h1>
            <p>
              You have accessed a page that does not exist. Customer service has
              been notified
            </p>
          </div>
          <button onClick={() => router.push("/")}>go back</button>
        </div>
      </div>
      <FooterComponent />
    </main>
  );
}

export default ErrorPage;
