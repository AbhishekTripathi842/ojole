import Carousel from "react-multi-carousel";
import Head from "next/head";
import Link from "next/link";
import Header from "../../components/common/header";
import Meta from "../../components/common/meta";
import FooterComponent from "../../components/common/footer";
import React, { useEffect, useRef, useState } from "react";
import { SlideShowAction } from "../../store/actions/slide-show-action";
import { connect } from "react-redux";
import { HomePageCardsAction } from "../../store/actions/home-page-cards-action";
import { HomePageVideoAction } from "../../store/actions/home-page-video-action";
import { SubscribeAction } from "../../store/actions/subscribe-action";
import Vimeo from "@u-wave/react-vimeo";
import LoginModal from "../../components/common/login-modal";
import RegisterModal from "../../components/common/register-modal";
import PreviewCardModal from "../browse-all/preview-modal";
import router from "next/router";
import headerReplyButton from "../../components/common/header-reply";
import { REGISTER_MODAL_OPEN } from "../../store/type";
import Cookies from "universal-cookie";
import validator from "validator";
const cookies = new Cookies();
const HomePage = ({
  dispatch,
  slideShowCardResponse,
  homePageCardResponse,
  homePageVideoResponse,
  emailSentResponse,
  subscribeResponse,
}) => {
  const [email, setEmail] = useState("");
  const [loginShowModal, setLoginShowModal] = useState(false);
  const [registerShowModal, setRegisterShowModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [cardData, setCardData] = useState("");
  const loginEmailRef = useRef(null);
  const [emailErr, setEmailErr] = useState("");
  const [subEmailErr, setSubEmailErr] = useState("");
  const HomePageApiCall = async () => {
    await dispatch(SlideShowAction());
    await dispatch(HomePageCardsAction());
    await dispatch(HomePageVideoAction());
  };
  const [token, setToken] = useState("");

  useEffect(() => {
    if (router.query.unAuth) {
      setLoginShowModal(true);
    }
    HomePageApiCall();
  }, []);

  // useEffect(() => {
  //   setToken(cookies.get("token"));

  //   // if (profileResponse.success) {
  //   //   router.reload();
  //   // }
  // }, [profileResponse]);
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1600 },
      items: 5,
      partialVisibilityGutter: 40,
      slidesToSlide: 1, // optional, default to 1.
    },
    desktop: {
      breakpoint: { max: 1600, min: 1024 },
      items: 4,
      partialVisibilityGutter: 40,
      slidesToSlide: 1, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 767.98 },
      items: 3,
      partialVisibilityGutter: 30,
      slidesToSlide: 1, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 767.98, min: 0 },
      items: 2,
      partialVisibilityGutter: 30,
      slidesToSlide: 1, // optional, default to 1.
    },
  };

  let cardsListData = homePageCardResponse.response.data
    ? homePageCardResponse.response.data
    : null;
  let slideShowList = slideShowCardResponse.response.data
    ? slideShowCardResponse.response.data.map((data) => (
        <div
          key={data.id}
          onClick={() => {
            setShowModal(true);
            setCardData(data);
          }}
        >
          <img src={data.thumbnail} className="carousel-img" />
        </div>
      ))
    : [];

  const SubscribeNewsLetter = async () => { 
    setSubEmailErr("");
    if (!validator.isEmail(email)) {
      setSubEmailErr("Please provide a valid email id");
      return;
    }

    let formData = new FormData();
    formData.append("email", email);
    await dispatch(SubscribeAction(formData));

  };



    useEffect(() => {
      console.log(subEmailErr)
  }, [subEmailErr,subscribeResponse]);

  console.log('cardsListData',cardsListData)

  return (
    <main>
      <Head>
        <title>Home</title>
        <Meta />
      </Head>
      <Header tokenData={(data)=>setToken(data)}/>
      <LoginModal
        showModal={loginShowModal}
        handleClose={() => setLoginShowModal(false)}
        registerModal={() => {
          setLoginShowModal(false);
          setRegisterShowModal(true);
        }}
        forgotPassword={() => {
          setLoginShowModal(false);
          setForgotPasswordModal(true);
        }}
      />

      <RegisterModal
        showModal={registerShowModal}
        handleClose={() => setRegisterShowModal(false)}
        loginModal={() => {
          setLoginShowModal(true);
          setRegisterShowModal(false);
        }}
        inputEmail={loginEmailRef.current ? loginEmailRef.current.value : ""}
      />
      <div className="home-page-body">
        <div className="header-img-div">
          <div className="img-overlay"></div>
           {/*  change in home page video logic */}
          <div className="hero-background" style={{ content: `url(${homePageVideoResponse.response.data && homePageVideoResponse.response.data.video_image})` }}></div>

          <div className="sub-header-div">
          {homePageVideoResponse.response.data && (
            <h1>{homePageVideoResponse.response.data.video_content}</h1>
            )}
            <div className="browse--btn">
              <Link href="browse-all">
                <button id="browse-all-btn">BROWSE ALL</button>
              </Link>
              {/* <button id="shop-card-btn">SHOP THIS CARD</button> */}
            </div>
            <div className="video-container">
              {homePageVideoResponse.response.data && (
                <Vimeo
                  video={`${homePageVideoResponse.response.data.video_link}`}
                  width="100%"
                  height="100%"
                  autoplay={true}
                  loop
                  showTitle={false}
                  showPortrait={false}
                  background={true}
                />
              )}
            </div>
          </div>
        </div>
        {cardsListData !== null ? (         
          <div className="card-section-div">
             <div>
              {cardsListData.map((cardList,index)=>{
                switch (index) {
                  case 0:
                        return <div className="card-illustration-div" >
                            <div className="first-div" style={{ backgroundColor: cardList.bg_color }}>
                            <h3>{cardList.card_title}{index}</h3>
                            <p>{cardList.card_content}</p>
                            <button onClick={() => router.push("/cards/category/" + cardList.category.slug)}>
                              BROWSE
                            </button>
                          </div>
                          <Link href={{ pathname: "/product", query: { id: cardList.id }, }}>
                            <a>
                              <div className="second-div">
                                <img src={cardList.card_img} alt="..." />  
                                <label className="shop-card-label">SHOP THIS CARD</label>
                              </div>
                            </a>
                          </Link>
                        </div>
                        break;
                  case 1:  
                        return  <div className="second-card-illustration-div">
                        <Link href={{ pathname: "/product",  query: { id: cardList.id }, }}  >
                          <a>
                            <div className="second-second-div">
                              <img src={cardList.card_img} alt="..." />
                              <label className="shop-card-label">SHOP THIS CARD</label>
                            </div>
                          </a>
                        </Link>
                        <div className="second-first-div" style={{ backgroundColor: cardList.bg_color }}>
                          <div className="card-caption-div">
                              <h3>{cardList.card_title}</h3>
                                <p>{cardList.card_content}</p>
                                <button  onClick={() => router.push( "/cards/category/" + cardList.category.slug )}> BROWSE </button>
                          </div>
                        </div>
                        </div>                
                      break;
                  case 2:  
                      return   <div className="card-illustration-div">
                              <div className="third-first-div" style={{ backgroundColor: cardsListData[2].bg_color }}>
                              <h3>{cardsListData[2].card_title}</h3>
                              <p>{cardsListData[2].card_content}</p>
                              <button onClick={() => router.push( "/cards/category/" + cardsListData[2].category.slug  )   }>
                                BROWSE
                              </button>
                            </div>
                            <Link href={{ pathname: "/product", query: { id: cardsListData[2].id }, }}>
                              <a>
                                <div className="second-div">
                                  <img src={cardsListData[2].card_img} alt="..." />
                                  <label className="shop-card-label">SHOP THIS CARD</label>
                                </div>
                              </a>
                            </Link>
                          </div>                  
                        break;
                }                
              })}
           </div>
          </div>
        ) : null}

        <div className="our-story-div">
          <h3>Our story</h3>
          <div className="circle-img-row-div">
            <div className="circle-img-div">
              <img src="/assets/image/story-one.svg" />
              <label>Our Story</label>
            </div>
            <div className="circle-img-div">
              <img src="/assets/image/from-the-studio.svg" />
              <label>From the Studio</label>
            </div>
            <div className="circle-img-div">
              <img src="/assets/image/press-and-review.svg" />
              <label>Press & Reviews</label>
            </div>
          </div>
          <div className="story-para-div">
            <p>
              I moved a lot as a child, growing up in four different countries
              and two continents. I kept a suitcase full of letters I wrote with
              friends. Some I have managed to stay in touch with until this day!{" "}
            </p>
            <button>LEARN MORE</button>
          </div>
        </div>
        {!token ? (
          <div className="sign-up-today-div">
            <div>
              <img src="/assets/image/sign-up-img.svg" />
            </div>
            <div className="sign-up-today-text-div">
              <h4>Sign Up today</h4>
              <h1>Ready to get started?</h1>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Volutpat ac dictumst ullamcorper eu. Ac ipsum lacus, nisi
                dictumst praesent id hendrerit ornare. Egestas venenatis vitae
                blandit sed.
              </p>
              <div>
                <input placeholder="example@email.com" ref={loginEmailRef} />
                <button
                  onClick={() => {
                    if (validator.isEmail(loginEmailRef.current.value)) {
                      setEmailErr("");
                      dispatch({
                        type: REGISTER_MODAL_OPEN,
                        payload: {
                          email: loginEmailRef.current
                            ? loginEmailRef.current.value
                            : "",
                        },
                      });
                    } else {
                      setEmailErr("Invalid Email");
                    }
                  }}
                >
                  SIGN UP
                </button>
              </div>
              <p className="error-style-p" style={{ textAlign: "left" }}>
                {emailErr}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="carousel-div">
        <h3>Popular Cards</h3>
        <PreviewCardModal
          showModal={showModal}
          handleClose={() => setShowModal(false)}
          data={cardData}
        />
        <Carousel
          swipeable={false}
          draggable={false}
          showDots={false}
          responsive={responsive}
          ssr={true} // means to render carousel on server-side.
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={5000}
          keyBoardControl={true}
          customTransition="all .5"
          transitionDuration={500}
          containerClass="carousel-container"
          // removeArrowOnDeviceType={["tablet", "mobile"]}
          dotListClass="custom-dot-list-style"
          itemClass="carousel-item-padding-20-px"
        >
          {slideShowList}
        </Carousel>
      </div>
      <div className="home-page-body">
        <div className="subscribe-news-letter-div">
          <label>Subscribe to our newsletter</label>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Volutpat ac
            dictumst ullamcorper eu.{" "}
          </p>
          <div>
            <input
              placeholder="example@email.com"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value.toLocaleLowerCase())}
            />
            <button onClick={() => SubscribeNewsLetter()}>SUBSCRIBE</button>
            
          </div>
          <p  style={{ color: "red" }}>{subEmailErr}</p>
          {subscribeResponse.success ? (
            <p style={{ color: "green" }}>Your subscription is successful!</p>
          ) : null}
          {subscribeResponse.error ? (
            <p style={{ color: "red" }}>We are facing some issue!</p>
          ) : null}

        </div>
      </div>
      <FooterComponent />
    </main>
  );
};

export default connect((state) => ({
  slideShowCardResponse: state.slideShowCardResponse,
  homePageCardResponse: state.homePageCardsResponse,
  homePageVideoResponse: state.homePageVideoResponse,
  emailSentResponse: state.emailSentResponse,
  subscribeResponse: state.subscribeResponse,
}))(HomePage);
