import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import LoginModal from "./login-modal";
import RegisterModal from "./register-modal";
import ForgotPasswordModal from "./forgot-password-modal";
import CreateListModal from "./create-list-modal";
import ConfirmDeleteModal from "./confirm-delete-modal";
import ConfirmAddedModal from "./confirm-added-modal";
import EditContactModal from "./edit-contact-modal";
import CardSharedModal from "./card-shared-modal";
import ReplyModal from "./reply-modal";
import ReplySentModal from "./reply-sent-modal";
import WarningModal from "./warning-modal";
import InfoModal from "./info-modal";
import Cookies from "universal-cookie";
import { connect } from "react-redux";
import router from "next/router";
import { LogoutAction } from "../../store/actions/logout-action";
import MenuModal from "./menu-modal";
import { CategoryAction } from "../../store/actions/category-action";
import { PopularSearchListAction } from "../../store/actions/popular-search-action";
import { LOGIN_MODAL_OPEN, REGISTER_MODAL_OPEN } from "../../store/type";
import { ArrowContainer, Popover } from "react-tiny-popover";

const cookies = new Cookies();
const Header = ({ dispatch, profileResponse,loginResponse, categoryResponse,popularSearchResponse, tokenData }) => {
  const initial = [];
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loginShowModal, setLoginShowModal] = useState(false);
  const [registerShowModal, setRegisterShowModal] = useState(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [createListModal, setCreateListModal] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [confirmAddedModal, setConfirmAddedModal] = useState(false);
  const [editContactModal, setEditContactModal] = useState(false);
  const [cardSharedModal, setCardSharedModal] = useState(false);
  const [replyModal, setReplyModal] = useState(false);
  const [replySentModal, setReplySentModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const [token, setToken] = useState("");
  const [loginData, setLoginData] = useState({});
  const [menuModal, setMenuModal] = useState(false);
  const [email, setEmail] = useState("");
  const [holidayData, setHolidayData] = useState("");
  const [occasionData, setOccasionData] = useState("");
  const [collectionData, setCollectionData] = useState("");
  const [navState, setNavState] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(router.query.searchData);
  const [popularSearchKeywords,setpopularSearchKeywords ] = useState(initial)
  useEffect( () => { 
    if(token!='' && token!==undefined )
      document.querySelector("body").classList.add("login--body") 
    else
      document.querySelector("body").classList.remove("login--body")     
  },[token]);
  
  useEffect(() => {
    setToken(cookies.get("token"));
    setLoginData(cookies.get("email"));
    tokenData(cookies.get("token"));
    // if (profileResponse.success) {
    //   router.reload();
    // }
  }, [profileResponse]);
  useEffect(() => {
    dispatch(CategoryAction());
    dispatch(PopularSearchListAction())
  }, []);

  useEffect(()=>{

  },[loginResponse])

  useEffect(() => {
    if (categoryResponse.success) {
      setHolidayData(categoryResponse.response.data[0]);
      setOccasionData(categoryResponse.response.data[1]);
      setCollectionData(categoryResponse.response.data[2]);
    }
  }, [categoryResponse]);

  useEffect(()=>{
    setpopularSearchKeywords(popularSearchResponse.response.data)
  },[popularSearchKeywords,popularSearchResponse]);

  function truncateString(str, num) {
    if (str.length > num) {
      return str.slice(0, num) + "...";
    } else {
      return str;
    }
  }
  return (
    <header className="main-header">
      <CreateListModal
        showModal={createListModal}
        handleClose={() => setCreateListModal(false)}
      />
      <ConfirmDeleteModal
        showModal={confirmDeleteModal}
        handleClose={() => setConfirmDeleteModal(false)}
      />
      <ConfirmAddedModal
        showModal={confirmAddedModal}
        handleClose={() => setConfirmAddedModal(false)}
      />
      <EditContactModal
        showModal={editContactModal}
        handleClose={() => setEditContactModal(false)}
      />
      <CardSharedModal
        showModal={cardSharedModal}
        handleClose={() => setCardSharedModal(false)}
      />
      <ReplyModal
        showModal={replyModal}
        handleClose={() => setReplyModal(false)}
      />
      <ReplySentModal
        showModal={replySentModal}
        handleClose={() => setReplySentModal(false)}
      />
      <WarningModal
        showModal={warningModal}
        handleClose={() => setWarningModal(false)}
      />
      <InfoModal
        showModal={infoModal}
        handleClose={() => setInfoModal(false)}
      />

      <MenuModal
        modalShow={menuModal}
        handleClose={() => setMenuModal(false)}
        menus={categoryResponse}
      />

      <div className="header-div">
        <div className="row">
          <div className="col-md-3">
            <div id="icons-div">
              <div id="icon-block">
                <a href="https://www.facebook.com/OjolieCards" target="_blank">
                  <img src="/images/facebook-icon.svg" />
                </a>
              </div>
              <div id="icon-block">
                <a href="https://www.pinterest.com/ojolie/" target="_blank">
                  <img src="/images/pinterest-icon.svg" />
                </a>
              </div>
              <div id="icon-block">
                <a
                  href="https://www.instagram.com/ojolie.ecards"
                  target="_blank"
                >
                  <img src="/images/instagram-icon.svg" />
                </a>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div id="middle-block">
              <img
                id="logo"
                src="/images/ojolie-logo.svg"
                onClick={() => Router.push("/")}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>

          <div className="col-md-3 d-flex justify-content-end">
            <div className="account-container">
              <div id="right-icons-div">
              <div className="my-component">
                <Popover  containerClassName="my-component-popover-1"
                  isOpen={searchOpen}
                  positions={["bottom"]}
                  padding={10}
                  reposition={false}
                  onClickOutside={() => {
                    setSearchOpen(false);
                  }}
                  content={({ position, childRect, popoverRect }) => (
                    
                    <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
                      position={position}
                      childRect={childRect}
                      popoverRect={popoverRect}
                      arrowColor={"blue"}
                      arrowSize={15}
                      arrowStyle={{ opacity: 0.7 }}
                      className="popover-arrow-container"
                      arrowClassName="popover-arrow"
                    >
                      <div className="arrow-container">

                      <div className="cross_ico" onClick={()=>setSearchOpen(false)}><svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.0095 15.3349L15.3354 14.0091C15.4532 13.8913 15.5711 13.8913 15.6889 14.0091L31.2453 29.5655C31.3631 29.6833 31.3631 29.8012 31.2453 29.919L29.9194 31.2448C29.8016 31.3627 29.6837 31.3627 29.5659 31.2448L14.0095 15.6885C13.8917 15.5706 13.8917 15.4528 14.0095 15.3349Z" fill="black"/>
<path d="M14.3631 29.2119L29.2124 14.3627C29.3302 14.2448 29.4481 14.2448 29.5659 14.3627L30.8917 15.6885C31.0096 15.8063 31.0096 15.9242 30.8917 16.042L16.0425 30.8913C15.9246 31.0091 15.8068 31.0091 15.6889 30.8913L14.3631 29.5654C14.2453 29.4476 14.2453 29.3297 14.3631 29.2119Z" fill="black"/>
</svg>
</div>
                        <div className="search_wrap">
                          <div className="input_outer">
                          <input
                              type="text"
                              placeholder="Search..."
                              value={searchValue}
                              onChange={(e) => setSearchValue(e.target.value)}
                            />
                            <span className="search_icon"><svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8.32 17.4238C3.712 17.4238 0 13.6206 0 8.89942C0 4.1782 3.712 0.375 8.32 0.375C12.928 0.375 16.64 4.1782 16.64 8.89942C16.64 13.6206 12.928 17.4238 8.32 17.4238ZM8.32 1.68645C4.416 1.68645 1.28 4.8995 1.28 8.89942C1.28 12.8993 4.416 16.1124 8.32 16.1124C12.224 16.1124 15.36 12.8993 15.36 8.89942C15.36 4.8995 12.224 1.68645 8.32 1.68645Z" fill="black"/>
  <path d="M14.5163 14.3188L20.2635 20.2072L19.3585 21.1344L13.6113 15.246L14.5163 14.3188Z" fill="black"/>
  </svg>
  </span>
                          </div>
                          
                          <button className="btn-secondary"
                            onClick={() => {
                              router.push({
                                pathname: "/cards/searchResult",
                                query: { searchData: searchValue },
                              });
                              setSearchOpen(false);
                            }}
                          >
                            Search
                          </button>
                          </div>
                        <div className="popular-search">
                          <div className="popular-search-title"><label>Popular Searches</label></div>
                          <div className="searches_result">
                         
                          { popularSearchKeywords.map((keyword, index) => {
                            return (<span className="popular-keywords" onClick={()=>{   
                                                       router.push({
                                                          pathname: "/cards/searchResult",
                                                          query: { searchData: keyword.keyword },
                                                        });
                                    setSearchOpen(false);
                                    }} >
                                      { keyword.keyword }
                                      { keyword.is_new ?
                                        <strong className="">NEW!</strong> : ''
                                      }
                                    </span>
                                    
                                    )
                          })
                          }
                        </div>
                      </div>
                      </div>
                     
                    </ArrowContainer>
                  )}
                >
                  <button
                    id="search-btn"
                    onClick={() => setSearchOpen(!searchOpen)}
                  >
                    <img src="/images/ei_search.svg" />
                  </button>
                </Popover>
</div>
                {token ? (
                  <>
                    <a href="/favorites" id="favorite-btn">
                      <img src="/images/favorite-icon.svg" />
                    </a>
                    <a href="/account">
                      <button id="profile-btn">
                        <img src="/images/profile-icon.svg" />
                      </button>
                    </a>

                    <button
                      id="heart-btn"
                      onClick={() => {
                        router.push({
                          pathname: "/favorites",
                        });
                      }}
                    >
                      <img src="/images/heart-icon.svg" />
                    </button>
                  </>
                ) : (
                  <a
                    onClick={() =>
                      dispatch({
                        type: LOGIN_MODAL_OPEN,
                        payload: { email: "" },
                      })
                    }
                  >
                    <button id="profile-btn">
                      <img src="/images/profile-icon.svg" />
                    </button>
                  </a>
                )}

                <button id="menu-btn" onClick={() => setMenuModal(true)}>
                  <img src="/images/menu-icon.svg" />
                </button>
              </div>
              <div id="account-div">
                {!token ? (
                  <ul>
                    <li
                      onClick={() => {
                        // setLoginShowModal(true)
                        dispatch({
                          type: LOGIN_MODAL_OPEN,
                          payload: { email: "" },
                        });
                      }}
                    >
                      <a href="#">LOGIN</a>
                    </li>
                    <li onClick={() => dispatch({ type: REGISTER_MODAL_OPEN })}>
                      <a href="#">SIGN UP</a>
                    </li>
                  </ul>
                ) : (
                  <ul>
                    <li>
                      <a href="/account">
                        {loginData
                          ? truncateString(`${loginData.data.first_name} ${loginData.data.last_name}`,10)
                          : ""}
                      </a>
                    </li>
                    <li
                      onClick={async () => {
                       
                        tokenData("");
                        setToken("");
                        setTimeout(setLoading(true), 5000)
                        await dispatch(LogoutAction());


                        router.push("/");
                      }}
                      style={{cursor: "pointer"}}
                    >
                      <a>LOGOUT</a>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-12">
            
          <div id="menu-div" className="d-flex justify-content-center">
                <ul>
                  <li  className={router.pathname == "/browse-all" ? "active" : ""}
                    onMouseEnter={() => {
                      setShowSubMenu(true);
                    }}
                    onMouseLeave={() => {
                      setShowSubMenu(false);
                    }}
                  >
                    <a href="/browse-all">Browse <span><img src="/images/dwn--arrow.svg" /></span></a>
                  </li>
                  <li>
                    <a href="#">Business Ecards</a>
                  </li>
                  <li className={router.pathname == "/pricing" ? "active" : ""}>
                    <a href="/pricing">Pricing</a>
                  </li>
                  <li className={router.pathname == "/about-us" ? "active" : ""}>
                    <a href="/about-us">About Us</a>
                  </li>
                  <li className={router.pathname == "/contact-us" ? "active" : ""}>
                    <a href="/contact-us">Contact Us</a>
                  </li>
                </ul>
              </div>
          </div>
        </div>
      </div>
      {showSubMenu ? (
        <div
          className="sub-menu-div"
          onMouseEnter={() => {
            setShowSubMenu(true);
          }}
          onMouseLeave={() => {
            setShowSubMenu(false);
            setShowAll(false);
          }}
        >
          <div className="sub-menu-main-div">
            <div className="sub-menu">
              {
                <>
                  <a
                    href={`/cards/category/${holidayData.slug}`}
                    className="header-link"
                  >
                    {holidayData.name}
                  </a>
                  {holidayData
                    ? holidayData.children.map((subData, index) => {
                        if (index < 5) {
                          return (
                            <a
                              key={subData.id}
                              href={`/cards/category/${subData.slug}`}
                              className="sub-menu-link"
                            >
                              {subData.name}
                            </a>
                          );
                        }

                        if (index > 4 && showAll) {
                          return (
                            <a
                              key={subData.id}
                              href={`/cards/category/${subData.slug}`}
                              className="sub-menu-link"
                            >
                              {subData.name}
                            </a>
                          );
                        }

                        if (index === 5 && !showAll) {
                          return (
                            <label
                              key={subData.id}
                              onClick={() => setShowAll(true)}
                              style={{ cursor: "pointer" }}
                            >
                              More ...
                            </label>
                          );
                        }
                      })
                    : null}
                  <a
                    href="/browse-all"
                    className="header-link"
                    style={{ fontWeight: "400", marginTop: "30px" }}
                  >
                    ALL ECARDS
                  </a>
                  <a
                    href="/cards/free"
                    className="header-link"
                    style={{ fontWeight: "400" }}
                  >
                    FREE ECARDS
                  </a>
                  <a
                    href="/browse-all"
                    className="header-link"
                    style={{ fontWeight: "400" }}
                  >
                    NEW ECARDS
                  </a>
                </>
              }
            </div>
            <div className="sub-menu">
              {
                <>
                  <a
                    href={`/cards/category/${occasionData.slug}`}
                    className="header-link"
                  >
                    {occasionData.name}
                  </a>
                  {occasionData
                    ? occasionData.children.map((subData) => (
                        <a
                          key={subData.id}
                          href={`/cards/category/${subData.slug}`}
                          className="sub-menu-link"
                        >
                          {subData.name}
                        </a>
                      ))
                    : null}
                </>
              }
            </div>
            <div className="sub-menu">
              {
                <>
                  <a
                    href={`/cards/category/${collectionData.slug}`}
                    className="header-link"
                  >
                    {collectionData.name}
                  </a>
                  {collectionData
                    ? collectionData.children.map((subData) => (
                        <a
                          key={subData.id}
                          href={`/cards/category/${subData.slug}`}
                          className="sub-menu-link"
                        >
                          {subData.name}
                        </a>
                      ))
                    : null}
                </>
              }
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
};
export default connect((state) => ({
  profileResponse: state.profileResponse,
  categoryResponse: state.categoryResponse,
  popularSearchResponse:state.popularSearchResponse,
  loginResponse:state.loginResponse,
}))(Header);
