import Head from "next/head";
import Link from "next/link";
import FooterComponent from "../../components/common/footer";
import Header from "../../components/common/header";
import Meta from "../../components/common/meta";
import Switch from "react-switch";
import { useEffect, useReducer, useState } from "react";
import AddressBookModal from "../../components/common/address-book-modal";
import ImportContactsModal from "../../components/common/import-contacts-modal";
import { connect } from "react-redux";
import { CardDetailAction } from "../../store/actions/card-detail-action";
import { SaveECardItemAction } from "../../store/actions/save-ecard-item-action";
import { useRouter } from "next/router";
import validator from "validator";
import { ArrowContainer, Popover } from "react-tiny-popover";
import { jsx, css } from "@emotion/react";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} from "react-share";

import {PAGINATION_LENGTH} from '../../store/type'
import ReactPaginate from 'react-paginate';
import ScheduleCalendarModal from "../../components/common/schedule-calendar-modal";
import { initalState, reducer } from "../../shared/default-reducer";
import { useAPIRequestWithPayload } from "../../shared/api-request-hook";
import { createDraftSendCard, sendECardItem } from "../../api/SendCardAPI";
import withAuthentication from "../../shared/authenticated-component";
import { SEND_CARD_DATA } from "../create-card";
import Cookies from "universal-cookie";
import PreviewCardModal from "../browse-all/preview-modal";
import CopyToClipboard from "react-copy-to-clipboard";
import { importContactList } from "../../api/AddressBookAPI";
import { Alert, Toast, ToastContainer } from "react-bootstrap";
import LoadingScreen from "../../components/common/loader";
import swal from 'sweetalert'

const cookies = new Cookies();
const user = cookies.get("type");
const SendEcard = ({
  dispatch,
  cardDetailResponse,
  saveECardItemResponse,
  draftECardSendItemResponse,
}) => {
  console.log(cardDetailResponse, 'lllll')
  const [loading, setLoading] = useState(false);
  const [nameErr, setNameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [emailReceivedChecked, setEmailReceivedChecked] = useState(false);
  const [sendLaterChecked, setSendLaterChecked] = useState(false);
  const [premium, setPremium] = useState(false);
  const [addressBookModal, setAddressBookModal] = useState(false);
  const [importContactsModal, setImportContactsModal] = useState(false);
  const [addressForm, setAddressForm] = useState({});
  const [addressList, setAddressList] = useState([]);
  const [sendCardData, setSendCardData] = useState({});
  const [emailMessage, setEmailMessage] = useState("");
  const [copiedLink, setCopiedLink] = useState("");
  // We start with an empty list of items.
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);  
  const itemsPerPage=PAGINATION_LENGTH;    
  const [isLinkSharePopoverOpen, setIsLinkSharePopoverOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState({
    timezone: { value: Intl.DateTimeFormat().resolvedOptions().timeZone },
    date: new Date(),
  });
  const [showScheduleDateModal, setShowScheduleDateModal] = useState(false);
  const [token, setToken] = useState("");

  const [sendState, sendDispatch] = useReducer(reducer, initalState);
  const [invokeSendEcard] = useAPIRequestWithPayload(
    sendDispatch,
    sendECardItem
  );
  const [preivewModal, setPreviewModal] = useState(false);
  const [cardData, setCardData] = useState("");
  const [copied, setCopied] = useState(false);
  const [draftSuccess, setDraftSuccess] = useState(false);
  const router = useRouter();
  const [importState, importDispatch] = useReducer(reducer, initalState);
  const [invokeImport] = useAPIRequestWithPayload(
    importDispatch,
    importContactList
  );
  const [draftState, dispatchDraft] = useReducer(reducer, initalState);
  const [invokeSaveDraft] = useAPIRequestWithPayload(
    dispatchDraft,
    createDraftSendCard
  );

  useEffect(() => {
    if (user === "1") {
      setPremium(true);
    } else {
      setPremium(false);
    }

    initScheduleDate();
  }, []);

  useEffect(() => {
    let value = window.sessionStorage.getItem(SEND_CARD_DATA);
    if (!value) {
      router.replace("/browse-all");
      return;
    }

    try {
      let data = JSON.parse(value);
      setSendCardData(data);
      setEmailReceivedChecked(data.pickup_noti == "1");

      dispatch(CardDetailAction(data.id));
    } catch {
      window.sessionStorage.removeItem(SEND_CARD_DATA);
      router.replace("/browse-all");
    }
  }, []);


  useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + itemsPerPage;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    console.log(addressList)
    setCurrentItems(addressList.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(addressList.length / itemsPerPage));
    
  }, [itemOffset, itemsPerPage ,addressList]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => { console.log(event)
    let selectedpage  =event.selected ? event.selected : event.selected
    const newOffset = (selectedpage * itemsPerPage) % addressList.length;
    console.log(
      `User requested page number ${event.selected} , which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
    
  };

  useEffect(() => {
    if (cardDetailResponse.response.data) {
      setLoading(false)
      setCardData(cardDetailResponse.response.data);
    }
  }, [cardDetailResponse.success]);

  useEffect(() => {
    if (sendState.success) {
      router.push({
        pathname: "email-sent-confirmation",
      });
    }
  }, [sendState]);

  useEffect(() => {
    if (draftState.success) {
      setDraftSuccess(true);
    } else {
      setDraftSuccess(false);
    }
  }, [draftState]);

  function initScheduleDate() {
    let initialState = { ...scheduleDate };
    if (initialState.timezone.value === 'Asia/Calcutta') {
      initialState.timezone.value = 'Asia/Kolkata'
    }
    let loginData = cookies.get("email");
    if (
      loginData &&
      loginData.data.details &&
      loginData.data.details.timezone
    ) {
      let timezone = loginData.data.details.timezone;
      initialState.timezone = {
        value: timezone == "Asia/Yangon" ? "Asia/Rangoon" : timezone,
      };
    }

    initialState.date = new Date();

    setScheduleDate(initialState);
  }

  function handleAddressChange(event) {
    setAddressForm({
      ...addressForm,
      [event.target.name]: event.target.value,
    });
  }

  function addAddress() {
    if (!addressForm.name) {
      setNameErr("Please enter name.")
    } else {
      setNameErr("")
    }

    if (!addressForm.email) {
      setEmailErr("Please enter email.")
    } else if (!validator.isEmail(addressForm.email)) {
      setEmailErr("Please enter valid email.")
    } else {
      setEmailErr("")
    }

    if (
      !addressForm.name ||
      !addressForm.email ||
      !validator.isEmail(addressForm.email)
    ) {
      return;
    }

    let data = {
      name: addressForm.name,
      email: addressForm.email,
    };

    if (!addressList.some((e) => e.email == data.email)) {
      let list = [...addressList];
      list.push(data);
      setAddressList(list);
      invokeImport({ contact_data: [`${data.name}, ${data.email}`] });
    }
    setAddressForm({});
  }

  function importContacts(contacts) {
    if (!contacts || contacts.length == 0) {
      return;
    }

    let list = [...addressList];
    for (let c of contacts) {
      if (!list.some((e) => e.email == c.email)) {
        list.push(c);
      }
    }

    setAddressList(list);
  }

  function removeAddress(index) {
    swal({
      title: "Are you sure?",
      text: "You want to delete address data!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, I am sure!',
      cancelButtonText: "No, cancel it!"
    }).then(
      function (res) { /*Your Code Here*/
        if (res) {
          let list = [...addressList];
          list.splice(index, 1);
          setAddressList(list);
        }
      },
    );
  }

  function handleAddressCheck(event, index) {
    const finditem=index
    let list = [...addressList];
    if (index == -1) {
      list.forEach((a) => {
        a.checked = event.target.checked;
      });
    } else {
//      list[index].checked = event.target.checked;     
        //alert(finditem) 
        let index = list.findIndex((item)=>item.id==finditem) 
        list[index].checked = event.target.checked;
    }
    setAddressList(list);
    setCopiedLink(
      cardDetailResponse.response && cardDetailResponse.response.data.filename
    );
  }

  function deleteSelectedAddress(event) {
    event.preventDefault();
    swal({
      title: "Are you sure?",
      text: "You want to delete address data!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, I am sure!',
      cancelButtonText: "No, cancel it!"
    }).then(
      function (res) { /*Your Code Here*/
        if (res) {
          let list = addressList.filter((e) => !e.checked);
          setAddressList(list);
        }
      },
    );
  }

  function saveDraft() {
    let data = {
      id: sendCardData.draft_id,
      ecard_id: sendCardData.id,
      greeting: sendCardData.greeting,
      message: sendCardData.message,
      pickup_noti: 1,
      draft: 1,
    };

    invokeSaveDraft(data);
  }

  function sendEcard(plateform=0) {
    if (sendState.loading) {
      return;
    }
    console.log(sendCardData)

    let ecard_id = sendCardData.id;
    let greeting = sendCardData.greeting;
    let message = sendCardData.message;

    if (!ecard_id || !greeting || !message) {
      router.replace({
        pathname: "/browse-all",
      });
      return;
    }

    if (addressList.length <= 0) {
      return;
    }

    var recepients =  addressList.map((item)=>{ return {name:item.name,email:item.email} })

    console.log('recepients')
    console.log(recepients)

    let data = {
      id: sendCardData.draft_id,
      ecard_id: ecard_id,
      greeting: greeting,
      email_message: emailMessage,
      message: message,
      creation_platform:plateform,
      pickup_noti: emailReceivedChecked,
      draft: 0,
      recipients: recepients,
    };

    if (sendLaterChecked) {
      let tz = scheduleDate.timezone;
      let date = scheduleDate.date;
      data["timezone"] = tz.value == "Asia/Rangoon" ? "Asia/Yangon" : tz.value;
      data[
        "scheduled_date"
      ] = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 00:00:00`;
    }
    setLoading(true)
    invokeSendEcard(data);
  }

  let cardDetail = cardDetailResponse.response.data;

  let addressBooks = (
    <div className="table-body-div">
      <div className="no-data-div">
        <label>0 Emails</label>
        <p>
          Add indivdual emails, lists, or select from your address book to get
          started.
        </p>
      </div>
    </div>
  );

  if (addressList.length > 0) {
    addressBooks = (
      <div>
      <table className="table mb-4">
        <thead>
          <tr>
            <th scope="col">
              <input
                type="checkbox"
                onChange={(event) => handleAddressCheck(event, -1)}
              />
            </th>
            <th scope="col">
              <label>Name</label>
              <img src="/assets/image/sort.svg" />
            </th>
            <th scope="col">
              <label>Email</label>
              <img src="/assets/image/sort.svg" />
            </th>
            <th scope="col">
              <a
                href="!#"
                className="float-end text-danger small"
                hidden={addressList.filter((e) => e.checked).length <= 0}
                onClick={deleteSelectedAddress}
              >
                <img src="/assets/image/trash-icon.svg" className="me-2" />
                Delete Selected
              </a>
            </th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((e, i) => {
            return (
              <tr key={i}>
                <td scope="row">
                  <input
                    type="checkbox"
                    checked={e.checked ?? false}
                    onChange={(event) => handleAddressCheck(event, e.id)}
                  />
                </td>
                <td>
                  <label>{e.name}</label>
                </td>
                <td>
                  <label>{e.email}</label>
                </td>
                <td>
                  <img
                    src="/assets/image/trash-icon.svg"
                    className="float-end"
                    onClick={() => removeAddress(i)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
                <nav aria-label="Page navigation comments" className="mt-4">
                <ReactPaginate
                  previousLabel="previous"
                  nextLabel="next"
                  breakLabel="..."
                  breakClassName="page-item"
                  breakLinkClassName="page-link"
                  pageCount={pageCount}
                  pageRangeDisplayed={4}
                  marginPagesDisplayed={2}
                  onPageChange={(e)=>handlePageClick(e)}
                  containerClassName="pagination justify-content-center"
                  pageClassName="page-item"
                  pageLinkClassName="page-link"
                  previousClassName="page-item"
                  previousLinkClassName="page-link"
                  nextClassName="page-item"
                  nextLinkClassName="page-link"
                  activeClassName="active"
                  // eslint-disable-next-line no-unused-vars
                  hrefBuilder={(page, pageCount, selected) =>
                    page >= 1 && page <= pageCount ? `/page/${page}` : '#'
                  }
                  hrefAllControls
                  forcePage='1'
                  onClick={(clickEvent) => {
                    console.log('onClick', clickEvent);
                  }}
                />
              </nav>  
              </div>
);
  }

  const shareButtonPropsFB = {
    url: cardDetailResponse.data && cardDetailResponse.data.filename,
    network: "Facebook",
  };
  const shareButtonPropsTwitter = {
    url: cardDetailResponse.data && cardDetailResponse.data.filename,
    network: "Twitter",
  };

  const shareButtonPropsLinkedIn = {
    url: cardDetailResponse.data && cardDetailResponse.data.filename,
    network: "Linkedin",
  };
  return (
    <main>
      {loading ?
        <LoadingScreen></LoadingScreen> : ''
      }
      {draftSuccess ? (
        <ToastContainer position="top-end" style={{ zIndex: "99999" }}>
          <Toast
            bg="info"
            onClose={() => setDraftSuccess(false)}
            show={draftSuccess}
            delay={3000}
            autohide
          >
            <Toast.Header>
              <strong className="me-auto">System Message</strong>
            </Toast.Header>
            <Toast.Body
            // style={{
            //   background: "#222c52",
            //   color: "white",
            //   zIndex: "999999",
            // }}
            >
              Your draft was save successfully
            </Toast.Body>
          </Toast>
        </ToastContainer>
      ) : null}
      <Head>
        <title>Home</title>
        <Meta />
      </Head>

      <AddressBookModal
        sendList={addressList}
        showModal={addressBookModal}
        handleClose={(list) => {
          setAddressBookModal(false);
          if (list && list.length > 0) {
            let temp = [...addressList];
            temp.push(...list);
            setAddressList(temp);
          }
        }}
      />

      <ImportContactsModal
        showModal={importContactsModal}
        handleClose={(contacts) => {
          importContacts(contacts);
          setImportContactsModal(false);
        }}
      />

      <ScheduleCalendarModal
        showModal={showScheduleDateModal}
        handleClose={() => setShowScheduleDateModal(false)}
        timezone={scheduleDate.timezone}
        date={scheduleDate.date}
        onChange={(tz, d) => {
          setScheduleDate({
            timezone: tz,
            date: d,
          });
        }}
      />

      <Header tokenData={(data) => setToken(data)} />
      <div className="send-ecard-div-wrapper">
        <div className="send-ecard-div">
          <div className="create-card-head-div">
            <div id="product-menu" style={{ padding: "0", width: "80%" }}>
              <ul>
                <li>
                  <Link href="#">HOME</Link>
                </li>
                <li>
                  <div id="left-space">/</div>
                  <Link href="#">ECARDS</Link>
                </li>
                <li>
                  <div id="left-space">/</div>
                  <Link href="#">POPULAR ECARDS</Link>
                </li>
                <li>
                  <div id="left-space">/</div>
                  <Link href="#">PARTY ANIMALS</Link>
                </li>
                <li>
                  <div id="left-space">/</div>
                  <Link href="#">Customize</Link>
                </li>
                <li>
                  <div id="left-space">/</div>
                  <Link href="#">PREVIEW</Link>
                </li>
                <li>
                  <div id="left-space">/</div>
                  <Link href="#">SEND</Link>
                </li>
              </ul>
            </div>
            <div
              className="create-card-head-action-div"
              style={{ width: "105px" }}
            >
              <img
                src="/assets/image/back-circle.svg"
                onClick={() => router.back()}
              />
              <img src="/assets/image/save-circle.svg" onClick={saveDraft} />
            </div>
          </div>
          <div className="send-ecard-back-button">
            <img src="/assets/image/back-arrow.svg" />
            <a
              href="!#"
              className="back-button-text"
              onClick={(e) => {
                e.preventDefault();
                router.back();
              }}
            >
              Back to customization
            </a>
          </div>
          <div className="send-ecard-body">
            <div className="send-ecard-left-body">
              <div className="address-book-div">
                <div className="address-book-head-div">
                  <h3>Address book</h3>
                  <div className="address-book-action-div">
                    <img
                      onClick={() => setAddressBookModal(true)}
                      src="/assets/image/address-book.svg"
                    />
                    {/* <img src="/assets/image/mylist.svg" /> */}
                    <img
                      onClick={() => setImportContactsModal(true)}
                      src="/assets/image/import-contacts.svg"
                    />
                  </div>
                </div>
                <div className="address-input-div mb-3">
                  <div
                    className="address-full-name position-relative"
                    style={{ marginRight: "25px" }}
                  >
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={addressForm.name ?? ""}
                      onChange={handleAddressChange}
                      placeholder="Full name"
                    ></input>
                    {nameErr && nameErr !== '' ? (
                      <p className="error-style-p custom-address-error">
                        {nameErr}
                      </p>
                    ) : null}
                  </div>
                  <div
                    className="address-full-name position-relative"
                    style={{ marginRight: "6px" }}
                  >
                    <label>Email</label>
                    <input
                      type="text"
                      name="email"
                      value={addressForm.email ?? ""}
                      onChange={handleAddressChange}
                      placeholder="example@email.com"
                    ></input>
                    {emailErr && emailErr !== '' ? (
                      <p className="error-style-p custom-address-error">
                        {emailErr}
                      </p>
                    ) : null}
                  </div>
                  <button onClick={addAddress}>
                    <img src="/assets/image/add-email-icon.svg" />
                  </button>
                </div>
              </div>
              <div className="mail-list-div">
                {addressBooks}

                <div className="email-btn-div">
                  <button
                    disabled={addressList.length <= 0}
                    id="send-recepients-btn"
                    onClick={()=>sendEcard()}
                    style={{
                      background: addressList.length > 0 ? "#222c52" : "",
                    }}
                  >
                    Send to ({addressList.length}) recepients
                  </button>
                  <button id="send-later-btn" onClick={saveDraft}>
                    Save for later
                  </button>
                  <div className="switch-div">
                    <div className="switch-text-div">
                      <Switch
                        onChange={() =>
                          setEmailReceivedChecked(!emailReceivedChecked)
                        }
                        checked={emailReceivedChecked}
                        onColor="#222C52"
                        offColor="#fff"
                        uncheckedIcon={false}
                        checkedIcon={false}
                        className="switch-style"
                      />
                      <label>Receive an email when the card is picked up</label>
                    </div>
                    <div className="switch-text-div">
                      <Switch
                        onChange={(checked) => {
                          if (!checked) {
                            initScheduleDate();
                          }
                          setShowScheduleDateModal(checked);
                          setSendLaterChecked(checked);
                        }}
                        checked={sendLaterChecked}
                        onColor="#222C52"
                        offColor="#fff"
                        uncheckedIcon={false}
                        checkedIcon={false}
                        className="switch-style"
                      />
                      <label>Send later</label>
                    </div>
                    {sendLaterChecked && (
                      <h4 className="date--wrap">{scheduleDate.date.toDateString()}</h4>
                    )}

                    {sendLaterChecked && (
                      <button
                        className="btn btn-link text-dark"
                        onClick={() => setShowScheduleDateModal(true)}
                      >
                        Change
                      </button>
                    )}
                    <p>
                      Do you need <a href="/help-FAQs">help?</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="send-ecard-right-body">
              <div className="share-div">
                <p>Share</p>
                <div className="share-icon-outer-div">
                  <div
                    className={
                      premium
                        ? "share-icon-div share-icon-premium-div"
                        : "share-icon-div"
                    }
                  >
                    <Popover
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
                          {copied ? (
                            <p>Linked is copied to clipboard!</p>
                          ) : null}

                          <div className="link-container">
                            <div className="link">
                              {cardDetail && cardDetail.filename}
                            </div>
                            <CopyToClipboard
                              text={cardDetail && cardDetail.filename}
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
                  <div
                    className={
                      premium
                        ? "share-icon-div share-icon-premium-div"
                        : "share-icon-div"
                    }
                  >
                    {/* <ShareButton {...shareButtonPropsTwitter}> */}
                    <TwitterShareButton
                      url={cardDetail && cardDetail.filename}
                      children={
                        <div className="icon-div">
                          <img
                            className="twitter-icon"
                            src="/assets/image/twitter.svg"
                          />
                        </div>
                      }
                      onShareWindowClose={() => sendEcard('2')}
                      title="card for you"
                    ></TwitterShareButton>
                    {/* </ShareButton> */}
                    <label>Twitter</label>
                  </div>
                  <div
                    className={
                      premium
                        ? "share-icon-div share-icon-premium-div"
                        : "share-icon-div"
                    }
                  >
                    {/* <ShareButton {...shareButtonPropsFB}> */}
                    <FacebookShareButton
                      url={cardDetail && cardDetail.filename}
                      children={
                        <div className="icon-div">
                          <img
                            className="facebook-icon"
                            src="/assets/image/facebook.svg"
                          />
                        </div>
                      }
                      onShareWindowClose={() => sendEcard('1')}
                      title="card for you"
                    ></FacebookShareButton>
                    {/* </ShareButton> */}
                    <label>Facebook</label>
                  </div>
                  <div
                    className={
                      premium
                        ? "share-icon-div share-icon-premium-div"
                        : "share-icon-div"
                    }
                  >
                    <LinkedinShareButton
                      url={cardDetail && cardDetail.filename}
                      children={
                        <div className="icon-div">
                          <img
                            className="linkedin-icon"
                            src="/assets/image/linkedin.svg"
                          />
                        </div>
                      }
                      onShareWindowClose={() => sendEcard('3')}
                      title="card for you"
                    ></LinkedinShareButton>

                    <label>Linkedin</label>
                  </div>
                </div>
              </div>
              <div className="personalized-msg-div">
                <p>Write a personlized email message</p>
                <label>Message</label>
                <textarea
                  value={emailMessage ?? ""}
                  onChange={(evt) => setEmailMessage(evt.target.value)}
                  placeholder="Write here..."
                />
              </div>
              <PreviewCardModal
                data={cardData}
                editData={sendCardData}
                showModal={preivewModal}
                handleClose={() => setPreviewModal(false)}
                type="preview"
              />
              <div className="send-card-product-preview-div">
                <img src={cardDetail ? cardDetail.thumbnail : ""} />
                <div
                  dangerouslySetInnerHTML={{ __html: sendCardData.greeting }}
                ></div>
                {/* <p>{sendCardData ? sendCardData.greeting : ""}</p> */}
                <div className="btn-div">
                  <button onClick={() => setPreviewModal(true)}>
                    View Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
    </main>
  );
};

export default withAuthentication(
  connect((state) => ({
    cardDetailResponse: state.cardDetailResponse,
    saveECardItemResponse: state.saveECardItemResponse,
    draftECardSendItemResponse: state.draftECardSendItemResponse,
  }))(SendEcard)
);
