import Link from "next/link";
import Router from "next/router";
import React, { useState } from "react";
import ReplyModal from "./reply-modal";
import ReplySentModal from "./reply-sent-modal";
import LoadingScreen from "../../components/common/loader";

const HeaderReply = ({ recipientId, disableReply, hideReply }) => {
  const [replyModal, setReplyModal] = useState(false);
  const [replySentModal, setReplySentModal] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <header className="main-header-reply">
      {loading ?
        <LoadingScreen></LoadingScreen> : ''
      }      
      <ReplyModal
        id={recipientId}
        showModal={replyModal}
        setLoading={setLoading}
        handleClose={(result) => {
          setReplyModal(false);
          if (result) {
            setReplySentModal(true);
            hideReply();
          }
        }}
      />
      <ReplySentModal
        showModal={replySentModal}
        handleClose={() => setReplySentModal(false)}
      />

      <div className="header-div" style={{ width: "100%" }}>
        <div className="row">
          <div className="col-0 col-lg-3">
            <div id="icons-div">
              <div id="icon-block">
                <Link href="#">
                  <img src="/images/facebook-icon.svg" />
                </Link>
              </div>
              <div id="icon-block">
                <Link href="#">
                  <img src="/images/pinterest-icon.svg" />
                </Link>
              </div>
              <div id="icon-block">
                <Link href="#">
                  <img src="/images/instagram-icon.svg" />
                </Link>
              </div>
              <div id="icon-block">
                <Link href="#">
                  <img src="/images/youtube-icon.svg" />
                </Link>
              </div>
              {/* <div id="icon-block">
                <Link href="#">
                  <img src="/images/google-icon.svg" />
                </Link>
              </div> */}
            </div>
          </div>

          <div className="col-0 col-lg-6">
            <div id="middle-block">
              <img
                id="logo"
                src="/images/ojolie-logo.svg"
                onClick={() => Router.push("/")}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>

          <div className="col-12 col-lg-3 d-flex justify-content-end align-items-center">
            <div className="account-container">
              <button
                hidden={disableReply === true}
                className="reply-button"
                onClick={() => setReplyModal(true)}
              >
                Write Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
export default HeaderReply;
