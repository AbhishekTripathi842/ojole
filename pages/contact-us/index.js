import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "../../components/common/header";
import Meta from "../../components/common/meta";
import Image from "next/image";
import FooterComponent from "../../components/common/footer";
import { connect } from "react-redux";
import validator from "validator";
import { ContactSendMessageAction } from "../../store/actions/contact-send-message-action";
import LoadingScreen from "../../components/common/loader";

function ContactUsPage({ dispatch, contactSendMessageResponse }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const SendMessageApi = () => {
    if (validateSubmitForm()) {
      setLoading(true)
      setErrors({});
      let formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("message", message);
      dispatch(ContactSendMessageAction(formData));
      ResetState();
    }
  };

  const validateSubmitForm = () => {
    setErrors({});
    let errorStatus = false;
    let errForm = {};

    if (name == "") {
      errForm.name = "The name field is required.";
      errorStatus = true;
    }else if (name.length>155) {
      errForm.name = "Length of name should be less than 155.";
      errorStatus = true;
    }
    if (email === undefined || email == "") {
      errForm.email = "The email field is required.";
      errorStatus = true;
    } else if (!validator.isEmail(email)) {
      errForm.email = "Please provide a valid email.";
      errorStatus = true;
    }else if (email.length>155) {
      errForm.email = "Length of email should be less than 155.";
      errorStatus = true;
    }
    if (message == "") {
      errForm.message = "The message field is required.";
      errorStatus = true;
    }else if (message.length>500) {
      errForm.message = "Length of message should be less than 500.";
      errorStatus = true;
    }
    if (errorStatus) {
      setErrors(errForm);
      return false;
    }
    setErrors({});
    return true;
  };

  const ResetState = () => {
    setName("");
    setEmail("");
    setMessage("");
    setErrors({});
    contactSendMessageResponse.response.success="";
  };
  useEffect(() => {
    if (contactSendMessageResponse.response.success) {
      ResetState();
    }
  }, [contactSendMessageResponse.response.success]);

  useEffect(() => {
    console.log(loading);
  }, [loading]);

  useEffect(() => { 
    setLoading(false)
  }, [contactSendMessageResponse]);


  return (
    <>
      <Head>
        <title>Contact Us</title>
        <Meta />
      </Head>
      <Header tokenData={(data) => setToken(data)} />

      <div className="contact-us-page-wrapper">
        <div className="contact-us-section">
          <div className="top-section">
            <h1>Contact Us</h1>
            <p>We will get back to you as soon as possible</p>
          </div>

          <div className="form-section">
            <div className="name-email-input-container">
              <div className="input-container m-0">
                <p>
                  Name<span className="required">*</span>
                </p>
                <input
                  type="text"
                  placeholder="First & last name here"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></input>
                {errors.name ? (
                  <p className="error-style-p">{errors.name}</p>
                ) : null}
                {contactSendMessageResponse.errors ? (
                  <p className="error-style-p">
                    {contactSendMessageResponse.errors.name}
                  </p>
                ) : null}
              </div>
              <div className="input-container m-0">
                <p>
                  Email<span className="required">*</span>
                </p>
                <input
                  type="email"
                  placeholder="Email here"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></input>
                {errors.email ? (
                  <p className="error-style-p">{errors.email}</p>
                ) : null}
                {contactSendMessageResponse.errors ? (
                  <p className="error-style-p">
                    {contactSendMessageResponse.errors.email}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="message-input-container">
              <p>
                Message<span className="required">*</span>
              </p>
              <textarea
                id="#"
                name="#"
                placeholder="Write here"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
              {errors.message ? (
                <p className="error-style-p">{errors.message}</p>
              ) : null}
              {contactSendMessageResponse.errors ? (
                <p className="error-style-p">
                  {contactSendMessageResponse.errors.message}
                </p>
              ) : null}
            </div>
            {contactSendMessageResponse.success ? (
              <p style={{ color: "#222c52", textAlign: "center" }}>
                Your message was sent successfully!
              </p>
            ) : null}
            <button onClick={() => SendMessageApi()}>SEND MESSAGE</button>

            <div className="contact-container">
              <img src="/assets/image/address-icon.svg" />
              <div className="contact-text">
                NØRREVANG 73, 1. TH, 3460 BIRKERØD, DENMARK
              </div>
            </div>
            <div className="contact-container">
              <img src="/assets/image/mail-icon.svg" />
              <div className="contact-text">service@ojolie.com</div>
            </div>
            <div className="contact-container mb-0">
              <img src="/assets/image/phone-icon.svg" />
              <div className="contact-text">+1-617-544-3319</div>
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
      {loading  ? 
       <LoadingScreen></LoadingScreen> :''
      }
    </>
  );
}

export default connect((state) => ({
  contactSendMessageResponse: state.contactSendMessageResponse,
}))(ContactUsPage);
