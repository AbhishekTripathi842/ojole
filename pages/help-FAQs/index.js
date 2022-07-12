import React, { useState } from "react";
import Head from "next/head";
import Header from "../../components/common/header";
import FooterComponent from "../../components/common/footer";
import ProfileMenu from "../../components/common/profile-menu";

function HelpFAQsPage() {
  const [token, setToken] = useState("");
  return (
    <main>
      <Head>
        <title>Help</title>
      </Head>
      <Header tokenData={(data)=>setToken(data)} />
      <div className="help-wrapper">
        <div className="help-container">
          <div className="row m-0">
            <div className="menu-section col-lg-3 p-0">
              <ProfileMenu tab="help-faq" name="Help/FAQs" />
            </div>
            <div className="main-section col-lg-9 p-0">
              <div className="help-card-container">
                <div className="row m-0">
                  <div className="card col-xl-4 col-6">
                    <img src="/assets/image/sending-card.svg" />
                    <label>Sending cards</label>
                  </div>
                  <div className="card col-xl-4 col-6">
                    <img src="/assets/image/address.svg" />
                    <label>Address Book</label>
                  </div>
                  <div className="card col-xl-4 col-6">
                    <img src="/assets/image/membership.svg" />
                    <label>Membership</label>
                  </div>
                  <div className="card col-xl-4 col-6">
                    <img src="/assets/image/policies.svg" />
                    <label>Policies</label>
                  </div>
                  <div className="card col-xl-4 col-6">
                    <img src="/assets/image/payment.svg" />
                    <label>Payments & refunds</label>
                  </div>
                  <div className="card col-xl-4 col-6">
                    <img src="/assets/image/contact-us.svg" />
                    <label>Contact Us</label>
                  </div>
                </div>
              </div>

              <section class="collapse-container">
                <input type="checkbox" name="collapse" id="handle1" />
                <label for="handle1">
                  How do I send a card via email?
                  <img className="drop-icon" src="/images/chevron-right.svg" />
                </label>
                <div class="content">
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem Ipsum
                    passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum.
                  </p>

                  <div className="screenshot-container">
                    <img src="/images/screenshot-1.jpg" />
                    <img src="/images/screenshot-2.jpg" />
                  </div>
                </div>
              </section>

              <section class="collapse-container">
                <input type="checkbox" name="collapse" id="handle2" />
                <label for="handle2">
                  How do a share a card on instagram?
                  <img className="drop-icon" src="/images/chevron-right.svg" />
                </label>
                <div class="content">
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem Ipsum
                    passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum.
                  </p>
                </div>
              </section>

              <section class="collapse-container">
                <input type="checkbox" name="collapse" id="handle3" />
                <label for="handle3">
                  How do I share a card on facebook?
                  <img className="drop-icon" src="/images/chevron-right.svg" />
                </label>
                <div class="content">
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem Ipsum
                    passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum.
                  </p>
                </div>
              </section>

              <section class="collapse-container">
                <input type="checkbox" name="collapse" id="handle4" />
                <label for="handle4">
                  How do I set the time zone for scheduling cards to be sent?
                  <img className="drop-icon" src="/images/chevron-right.svg" />
                </label>
                <div class="content">
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem Ipsum
                    passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum.
                  </p>
                </div>
              </section>

              <section class="collapse-container">
                <input type="checkbox" name="collapse" id="handle5" />
                <label for="handle5">
                  The recipient has not received the card.
                  <img className="drop-icon" src="/images/chevron-right.svg" />
                </label>
                <div class="content">
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem Ipsum
                    passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum.
                  </p>
                </div>
              </section>

              <section class="collapse-container">
                <input type="checkbox" name="collapse" id="handle6" />
                <label for="handle6">
                  How do I see the status of the card sent or scheduled to be
                  sent?
                  <img className="drop-icon" src="/images/chevron-right.svg" />
                </label>
                <div class="content">
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem Ipsum
                    passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum.
                  </p>
                </div>
              </section>

              <section class="collapse-container">
                <input type="checkbox" name="collapse" id="handle7" />
                <label for="handle7">
                  How do I change the card or email message or add recipients?
                  <img className="drop-icon" src="/images/chevron-right.svg" />
                </label>
                <div class="content">
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem Ipsum
                    passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum.
                  </p>
                </div>
              </section>

              <section class="collapse-container">
                <input type="checkbox" name="collapse" id="handle8" />
                <label for="handle8">
                  How do I change the scheduled time for a card?
                  <img className="drop-icon" src="/images/chevron-right.svg" />
                </label>
                <div class="content">
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem Ipsum
                    passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
    </main>
  );
}

export default HelpFAQsPage;
