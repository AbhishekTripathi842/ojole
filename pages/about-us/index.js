import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "../../components/common/header";
import Meta from "../../components/common/meta";
import Image from "next/image";
import FooterComponent from "../../components/common/footer";
import { REGISTER_MODAL_OPEN } from "../../store/type";
import validator from "validator";
import { useDispatch } from "react-redux";
function AboutUsPage() {
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const dispatch = useDispatch();
  const [token, setToken] = useState("");
  return (
    <main>
      <Head>
        <title>About Us</title>
        <Meta />
      </Head>
      <Header tokenData={(data) => setToken(data)} />
      <div className="about-us-page-wrapper">
        <div id="about-top-section"><img src="http://localhost:3000/images/about-us-img-1.svg"></img></div>

        <div id="our-story-section">
          <h1>Our Story</h1>
          <div className="row" id="story-studio-reviews">
            <div className="col-md-4">
              <img src="/images/our-story.svg" />
              <p id="caption">Our Story</p>
            </div>
            <div className="col-md-4">
              <img src="/images/from-the-studio.svg" />
              <p id="caption">From the Studio</p>
            </div>
            <div className="col-md-4">
              <img src="/images/press-and-reviews.svg" />
              <p id="caption">Press &amp; Reviews</p>
            </div>
          </div>

          <div id="desc-div">
            <p>
              I moved a lot as a child, growing up in four different countries
              and two continents. I kept a suitcase full of letters I wrote with
              friends. Some I have managed to stay in touch with until this day!{" "}
            </p>
            <p>
              <i>
                The days of snail mail might sound nostalgic, but the
                fundamental need to keep in touch and reach out is timeless.{" "}
              </i>
            </p>
            <p className="mb-0">
              When we embarked on our own adventure in 2005 of starting Ojolie,
              we also made a huge change in our lives. We sold our house and
              said goodbye to our friends in the US. We wanted to show our
              children the world and have more quality time together.
            </p>
          </div>

          <div id="studio-images">
            <div className="col-md-4">
                <img src="/images/Ojolie_Studio_1.svg" />
              </div>
              <div className="col-md-4">
                <img src="/images/Ojolie_Studio_7 1.svg" />
              </div>
              <div className="col-md-4">
                <img src="/images/Ojolie_Studio_15 1.svg" />
              </div>
           
          </div>

          <div id="desc-div">
            <p>
              Once again I was reminded of the need to keep in touch - and our
              new journey of living half way around the world provided lots of
              new inspiration for my animated stories. This was how Ojolie was
              born. Over the years I have received touching messages from
              members all over the world who share how my cards have made a
              difference in their lives. That is tremendously rewarding and
              joyful.
            </p>
            <p><i>
              Our illustrations and animations make it easier to express what
              might be difficult in words alone. Each card is a short story.</i>
            </p>
          </div>
        </div>

        <div id="single-image-section">
          <img src="/images/Frame 485.svg" />
        </div>

        <div id="our-team-section">
          <h2>Our Team</h2>
          <div className="row">
            <div className="col-6">
              <img src="/images/Frederikke.svg" />
              <p id="name">Frederikke Tu</p>
              <p id="desc">Artist &amp; Founder</p>
            </div>
            <div className="col-6">
              <img src="/images/Timothy.svg" />
              <p id="name">Timothy Tu</p>
              <p id="desc">It Director</p>
              <p></p>
            </div>
          </div>
        </div>

        <div id="single-image-section">
          <img src="/images/Owlette-Process.svg" />
        </div>

        <div id="studio-work-section">
          <h2>Studio Work</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
            phasellus tempus justo commodo ullamcorper risus id. Enim congue
            consectetur nunc in. Magna ut metus congue eget vel faucibus. Purus
            proin enim, id dui. Eros enim cras ipsum aliquam. Faucibus ut
            tristique maecenas amet. Etiam quisque amet hac velit. Urna felis,
            nunc nulla elit. Est diam, amet feugiat facilisis urna lobortis.
          </p>
        </div>

        <div id="single-image-section">
          <div
            id="carouselExampleIndicators"
            className="carousel slide"
            data-ride="carousel"
          >
            <ol className="carousel-indicators">
              <li
                data-target="#carouselExampleIndicators"
                data-slide-to="0"
                className="active"
              ></li>
              <li
                data-target="#carouselExampleIndicators"
                data-slide-to="1"
              ></li>
              <li
                data-target="#carouselExampleIndicators"
                data-slide-to="2"
              ></li>
            </ol>
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img
                  className="d-block w-100"
                  src="/images/slider-img-1.svg"
                  alt="First slide"
                />
              </div>
              <div className="carousel-item">
                <img
                  className="d-block w-100"
                  src="/images/slider-img-1.svg"
                  alt="Second slide"
                />
              </div>
              <div className="carousel-item">
                <img
                  className="d-block w-100"
                  src="/images/slider-img-1.svg"
                  alt="Third slide"
                />
              </div>
            </div>
            <a
              className="carousel-control-prev"
              href="#carouselExampleIndicators"
              role="button"
              data-slide="prev"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
            </a>
            <a
              className="carousel-control-next"
              href="#carouselExampleIndicators"
              role="button"
              data-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
            </a>
          </div>
        </div>

        <div id="normal-text-section">
          <h2>Other Title</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
            phasellus tempus justo commodo ullamcorper risus id. Enim congue
            consectetur nunc in. Magna ut metus congue eget vel faucibus. Purus
            proin enim, id dui. Eros enim cras ipsum aliquam. Faucibus ut
            tristique maecenas amet. Etiam quisque amet hac velit. Urna felis,
            nunc nulla elit. Est diam, amet feugiat facilisis urna lobortis.
          </p>
        </div>

        <div id="press-and-reviews-section">
          <div id="pr-bg">
            <h2>Press &amp; Reviews</h2>
            <div className="row">
              <div className="col-md-4">
                <div id="pr-block-active">
                  <img src="/images/news-paper-icon.svg" />
                  <h3 id="title">Newspaper &amp; Magazines</h3>
                  <p id="detail">
                    <span id="highlight">Real Simple</span>
                    <br />
                    The Guardian
                    <br />
                    The Independent
                    <br />
                    International Business Times
                  </p>
                </div>
              </div>

              <div className="col-md-4 mb-md-0 mb-3">
                <div id="pr-block">
                  <img src="/images/online-icon.svg" />
                  <h3 id="title">Online Mentions</h3>
                  <p id="detail">
                    Green Living Ideas
                    <br /> Go Animate
                    <br /> Technorms
                    <br /> Pretty Opinionated
                  </p>
                </div>
              </div>

              <div className="col-md-4  mb-md-0 mb-3">
                <div id="pr-block">
                  <img src="/images/top-pick-icon.svg" />
                  <h3 id="title">Top Picks &amp; Reviews</h3>
                  <p id="detail">
                    About.com for Birthday
                    <br />
                    About.com for Christmas
                    <br />
                    Review Centre
                    <br />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {!token ? (
          <div className="sign-up-today-div mb-5">
            <div style={{ margin: "0 60px" }}>
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
                <input
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  onClick={() => {
                    if (validator.isEmail(email)) {
                      setEmailErr("");
                      dispatch({
                        type: REGISTER_MODAL_OPEN,
                        payload: {
                          email: email,
                        },
                      });
                    } else {
                      setEmailErr("Invalid Email!");
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
      <FooterComponent />
    </main>
  );
}

export default AboutUsPage;
