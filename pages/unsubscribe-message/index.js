import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "../../components/common/header";
import Meta from "../../components/common/meta";
import Image from "next/image";
import FooterComponent from "../../components/common/footer";

function UnsubscribeMessagePage() {
  const [token, setToken] = useState("");

    return (
      <main>
        <Head>
          <title>Unsubscribe</title>
          <Meta />
        </Head>
        <Header tokenData={(data)=>setToken(data)} />
  
        <div className="unsubscribe-message-page-wrapper">
            <div className="unsubscribe-message-section">
            
                <h1>We will miss you.</h1>
                <p>You have unsubscribed our newsletter.</p>
                <Link href="/home">
                    <button>Back to home</button>
                </Link>
                
                {/* <img src="/assets/image/hand-with-heart.svg"/> */} 

            </div>
        </div>
        <FooterComponent />
      </main>
    );
  }
  
  export default UnsubscribeMessagePage;