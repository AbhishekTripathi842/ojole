import { useState,useReducer, useEffect } from "react";
import { initalState, reducer } from "../../shared/default-reducer";
import { Alert, Modal } from "react-bootstrap";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} from "react-share";
import { Popover } from "react-tiny-popover";
import CopyToClipboard from "react-copy-to-clipboard";
import { useAPIRequestWithPayload } from "../../shared/api-request-hook";
import { shareCountUpdate } from "../../api/MyCardsAPI";
import { ECardSendItemDetailAction } from "../../store/actions/ecard-send-item-detail-action"; 

const ShareModal = ({ getUpdateData, showModal, handleClose, data }) => {
  const [shareCountState, shareCountDispatch] = useReducer(reducer, initalState);

  const [isLinkSharePopoverOpen, setIsLinkSharePopoverOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [invokeShareCount] = useAPIRequestWithPayload(
    shareCountDispatch,
    shareCountUpdate
    );

  const increaseShareCount = (plateform) =>{
    invokeShareCount(
       {id:data.id,plateform:plateform}
      );
    
    getUpdateData(data.id);  
  }


  return (
    <Modal show={showModal} onHide={handleClose} className="share-modal">
      <Modal.Header closeButton>
        <Modal.Title>Share</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="share-div">
          <div className="share-icon-outer-div">
            <div className="share-icon-div">
              <Popover
                containerStyle={{zIndex:"9999999"}}
                isOpen={isLinkSharePopoverOpen}
                positions={["bottom"]}
                padding={10}
                reposition={false}
                onClickOutside={() => {
                  setIsLinkSharePopoverOpen(false);
                  setCopied(false);
                }}
                content={({ position, childRect, popoverRect }) => (
                  <div className="popup-container">
                    <div className="popup-close-btn">
                      <img
                        src="/assets/image/close-btn.png"
                        onClick={() => {
                          setIsLinkSharePopoverOpen(false);
                          setCopied(false);
                        }}
                      />
                    </div>
                    {copied ? <p>Linked is copied to clipboard!</p> : null}

                    <div className="link-container">
                      <div className="link">{data}</div>
                      <CopyToClipboard
                        text={data}
                        onCopy={() => setCopied(true)}
                      >
                        <div className="copy-btn">COPY LINK</div>
                      </CopyToClipboard>
                    </div>

                    {/* <button
                            onClick={() =>
                              navigator.clipboard.writeText(
                                cardDetailResponse.response &&
                                  cardDetailResponse.response.data.filename
                              )
                            }
                          >
                            Copy Link
                          </button> */}
                  </div>
                )}
              >
                <div
                  className="icon-div"
                  onClick={() => setIsLinkSharePopoverOpen(true)}
                >
                  <img
                    className="link-icon"
                    src="/assets/image/share-link.svg"
                  />
                </div>
              </Popover>
              <label>Link</label>
            </div>
            <div className="share-icon-div">
              <TwitterShareButton
                url={data.ecard && data.ecard.filename}
                children={
                  <div className="icon-div">
                    <img class="twitter-icon" src="/assets/image/twitter.svg" />
                  </div>
                }
                title="card for you"
                onShareWindowClose={() =>increaseShareCount(2)}
              />

              <label>Twitter</label>
            </div>
            <div className="share-icon-div">
              <FacebookShareButton
                url={data.ecard && data.ecard.filename}
                children={
                  <div className="icon-div">
                    <img
                      class="facebook-icon"
                      src="/assets/image/facebook.svg"
                    />
                  </div>
                }
                title="card for you"
                onShareWindowClose={() =>increaseShareCount(1)}
              />

              <label>Facebook</label>
            </div>
            <div className="share-icon-div">
              <LinkedinShareButton
                url={data.ecard && data.ecard.filename}
                children={
                  <div className="icon-div">
                    <img
                      class="linkedin-icon"
                      src="/assets/image/linkedin.svg"
                    />
                  </div>
                }
                title="card for you"
                onShareWindowClose={() =>increaseShareCount(3)}
              />

              <label>Linkedin</label>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default ShareModal;
