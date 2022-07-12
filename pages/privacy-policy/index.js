import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "../../components/common/header";
import Meta from "../../components/common/meta";
import FooterComponent from "../../components/common/footer";
import router from "next/router";

function PrivacyPolicyPage() {
    const [token, setToken] = useState("");
    return (
      <main>
        <Head>
          <title>Privacy Policy</title>
          <Meta />
        </Head>
        <Header tokenData={(data)=>setToken(data)} />
  
        <div className="privacy-policy-page-wrapper">
            
                <div className="top-section">
                <h1>Privacy policy</h1>
                </div>

                <div className="grey-container">
                    <p className="head">Notifications</p>
                    <p className="body">At Ojolie we take your privacy seriously. That is why we will never distribute or sell your personal information. 
                    And we only gather the minimum data needed for us to provide the services to you, so you can send your ecards with a peace of mind. 
                    You will not find a long privacy policy filled with legalese. This policy tells you in simple terms what we collect, why we collect it, 
                    what we do with it and how we keep it safe. And if you ever want us to delete any data, just contact us. If we change the terms of this policy, 
                    we will contact your by email to inform you of the new policy.</p>
                </div>
                <div className="blue-container">
                    <p className="head">Collecting & Using Information About You</p>
                    <p className="body">You can visit most of our pages without revealing any personal information about yourself. 
                    We may track the Internet domain address from which people visit us and analyze this data for trends and statistics, 
                    but individual users will remain anonymous, unless you create an account and sign in. We do use cookies that may track your ip, 
                    which you can read more about in our cookies section. When you become a member we ask you to provide certain information about yourself, 
                    such as your name, billing address, telephone number, e-mail address, credit card information, etc. We also maintain a record of your online card history. 
                    For your safety we will not store your credit card information. We store your other data as long as you have an account for your convenience and by becoming 
                    a member of our site you agree to allow us to store information about your ordering history, card sent history, etc. as long as you have an account with us. 
                    If you cancel or do not renew your paid membership, your account will still be available to send free cards. We keep your account for your convenience, 
                    if you wish to renew again as many of our members do. If you wish to have your account completely deleted, simply contact us.
                    <br /><br/>
                    We contract with companies or persons to provide certain services, including credit card processing, accounting and email services. 
                    We supply these service providers with the information needed for them to perform these services. We also ask our service providers to confirm that 
                    their privacy practices are consistent with ours. If you wish for your data to be deleted, simply contact us.</p>
                </div>
                <div className="grey-container">
                    <p className="head">E-mails</p>
                    <p className="body">If you sign up for an account, we will e-mail you to notify you of ecards you have requested be sent, various administrative 
                    reminders and our optional newsletters. We will never send spam to you or your recipients. We will never sell your email address or your recipients' 
                    email addresses to any third party.
                    <br/><br/>
                    Our optional newsletter is sent out using Elastic Email. By opting-in to our optional newsletter you agree to allow us to use Elastic Email as 
                    our service provider, even though their servers are located outside the EU. You can read their privacy policy for full details.
                    <br/>
                    You can unsubscribe to our newsletter at any time by clicking the unsubscribe link at the bottom of our emails and/or have any of your data deleted by contacting us.</p>
                </div>
                <div className="blue-container">
                    <p className="head">International Transfer of Information</p>
                    <p className="body">By using our site and services, you acknowledge and agree that your personal data may be transmitted, transferred, processed, 
                    and stored outside the EU, as our server is located in the United States. Your data could therefore become available to governmental authorities 
                    under lawful orders and laws applicable in such jurisdictions. We will use reasonable means to ensure that your information is protected, but 
                    cannot guarantee that the laws of any foreign jurisdiction will accord the same degree of protection as the laws of the EU and Denmark, 
                    where we are incorporated.</p>
                </div>
                <div className="grey-container">
                    <p className="head">Cookies</p>
                    <p className="body">Our website uses "cookies". A cookie is a small amount of data that is sent to your browser from a web server 
                    and stored on your computer's hard drive. We use some cookies that a site cannot function without, categorized as necessary cookies. 
                    For example, we use a cookie to indicate that you have signed in, thus allowing you to visit the member-only section of the site. 
                    <br/>
                    We also use cookies for statistics that helps us understand how visitors to our site behave by collecting information anonymously, 
                    for example by using Google Analytics, Google AdWords (Conversion Tracking), and Facebook (Conversion Tracking).
                    <br/>
                    For more information or to opt-out, please visit the respective website(s) of these vendors or contact us.</p>
                </div>
                <div className="blue-container">
                    <p className="head">Security</p>
                    <p className="body">We strive to protect your personal information and use encryption and authentication technology. 
                    No data transmission over the Internet can be guaranteed to be 100% secure and we cannot absolutely guarantee the security of the 
                    information you transmit via our site. For your safety we will not store your credit card information. In the event of a breach of security, 
                    we will promptly notify our account holders in compliance with applicable law.</p>
                </div>
                <div className="grey-container">
                    <p className="head">Access to Your Personal Information</p>
                    <p className="body">If you wish to view and update your account information, simply sign in to your account. Please note that in order to 
                    have a working account, certain personal information is required, so if you wish to have all your personal information deleted, you will be 
                    cancelling your account with us. If you wish to have your personal information and records deleted, contact us any time. We will acknowledge 
                    your request within 72 hours as required by law.
                    <br/><br/>
                    If you have received an ecard from a member of our site and no longer wish for your name and email address to be stored by us, simply 
                    contact us and let us know. If you no longer wish to receive ecards from our site, we will need to store your email on a list that our users 
                    cannot send cards to, which means you will need to give us permission to keep a record of your email for that and only that purpose.</p>
                </div>
                <div className="contactus-section">
                <h1>Contact us</h1>
                <p>If you wish to have your personal information and records deleted, contact us any time.</p>
                <button onClick={()=>router.push("/contact-us")}>contact us</button>
                </div>
        </div>
        <FooterComponent />
      </main>
    );
  }
  
  export default PrivacyPolicyPage;