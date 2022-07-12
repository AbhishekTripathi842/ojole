import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "../../components/common/header";
import Meta from "../../components/common/meta";
import FooterComponent from "../../components/common/footer";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { CardDetailAction } from "../../store/actions/card-detail-action";
import { RecommendCardsListAction } from "../../store/actions/recommend-cards-action";
import { FavoriteCardCheckAction } from "../../store/actions/favorite-card-check-action";
import VimeoPlayer from "react-player/vimeo";
import { FavoriteCardToggleAction } from "../../store/actions/favorite-cards-toggle-action";
import { SEND_CARD_DATA } from "../create-card";
import Cookies from "universal-cookie";
import PreviewCardModal from "../browse-all/preview-modal";

const cookies = new Cookies();

const ProductPage = ({
  dispatch,
  cardDetailResponse,
  recommendCardsResponse,
  favoriteCardCheckResponse,
  favoriteCardToggleResponse,
  profileResponse,
}) => {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [favoriteToggle, setFavoriteToggle] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [cardDetail, setCardDetail] = useState("");

  useEffect(() => {
    setToken(cookies.get("token"));

    // if (profileResponse.success) {
    //   router.reload();
    // }
  }, [profileResponse]);

  useEffect(() => {
    if (favoriteCardCheckResponse.success) {
      setFavoriteToggle(favoriteCardCheckResponse.response.favorite_status);
    }
  }, [favoriteCardCheckResponse]);

  useEffect(() => {
    if (favoriteCardToggleResponse.success) {
      setFavoriteToggle(!favoriteToggle);
    }
  }, [favoriteCardToggleResponse]);

  useEffect(() => {
    cardDetailResponse.success = false;
    window.sessionStorage.removeItem(SEND_CARD_DATA);
    dispatch(CardDetailAction(router.query.id));
    dispatch(RecommendCardsListAction());
    dispatch(FavoriteCardCheckAction(router.query.id));
  }, []);

  useEffect(() => {
    if (cardDetailResponse.success) {
      setCardDetail(cardDetailResponse.response.data);
    }
  }, [cardDetailResponse]);
  function toggleFavorite() {
    dispatch(FavoriteCardToggleAction(router.query.id));
  }

  useEffect(() => {
    console.log(
      "favorite check res " + JSON.stringify(favoriteCardCheckResponse)
    );
    console.log(
      "favorite toggle Response " + JSON.stringify(favoriteCardToggleResponse)
    );
  }, [favoriteCardCheckResponse, favoriteCardToggleResponse]);

  function customizeButton(premium) {
    return (
      <button
        id="cs-btn"
        onClick={() => {
          let date = new Date();
          let type = cookies.get("type"); 
          let email = cookies.get("email"); 
          //console.log(email)
          //if(type=='1')
          let expiry_date = email!=undefined ? new Date(email.data.expires) : null;
          let subscription_type = email!=undefined ? email.data.subscription_type : null;

          //alert(type+premium+date+expiry_date); return ;
          if (premium == 1 && (type == 0 || (subscription_type!=1 && date>expiry_date) )) {
            router.push({
              pathname: "/pricing",
            });
          } else {
            let data = {
              id: cardDetail.id,
            };
            window.sessionStorage.setItem(SEND_CARD_DATA, JSON.stringify(data));
            router.push({
              pathname: "/create-card",
            });
          }
        }}
      >
        Customize &amp; Send
      </button>
    );
  }

  let recommendCardList = recommendCardsResponse.response.data
    ? recommendCardsResponse.response.data.map((data) => (
        <div className="col-md-6 col-lg-6 col-xl-4" key={data.id}>
          <div id="recommend-product">
            <img id="product-img" src={data.thumbnail} />
            <h2>{data.caption}</h2>
            {data.private === 1 ? (
              <p>
                <img id="premium-icon" src="/images/diamond-solid.svg" />{" "}
                PREMIUM
              </p>
            ) : (
              <p>FREE</p>
            )}
          </div>
        </div>
      ))
    : null;
  return (
    <main>
      <Head>
        <title>Product Page</title>
        <Meta />
      </Head>
      <Header tokenData={(data)=>setToken(data)} />
      <PreviewCardModal
        showModal={previewModal}
        handleClose={() => setPreviewModal(false)}
        data={cardDetail}
        type="product"
      />
      <div className="product-page-wrapper">
        <div id="product-menu">
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
          </ul>
        </div>

        <div id="product-top-section">
          <div className="row">
            <div className="col-md-7">
              <div className="video-container">
                {/* <img
                id="product-img"
                src={cardDetail ? cardDetail.thumbnail : ""}
              /> */}
                {cardDetail && (
                  <VimeoPlayer
                    url={`https://vimeo.com/${cardDetail.video}`}
                    width="100%"
                    height="100%"
                    controls
                    playsinline={true}
                  />
                )}
              </div>
            </div>
            <div className="col-md-5">
              <div id="product-desc-div">
                {token ? (
                  <button className="btn btn-link" style={{boxShadow:"none"}} onClick={toggleFavorite}>
                    {favoriteToggle ? (
                      <img
                        id="heart-icon"
                        src="/images/favorite-active-icon.png"
                      />
                    ) : (
                      <img id="heart-icon" src="/images/Group 214.svg" />
                    )}
                  </button>
                ) : null}

                <h1>{cardDetail ? cardDetail.caption : ""}</h1>
                <p>{cardDetail ? cardDetail.detail : ""}</p>
                {cardDetail ? (
                    parseInt(cardDetail.private) == 1 ? (
                    <h3>
                      <img src="/images/diamond-solid.svg" /> Premium Card
                    </h3>
                  ) : (
                    <h3>Free Card</h3>
                  )
                ) : null}

                {cardDetail && customizeButton(cardDetail.private)}

                <button id="pe-btn" onClick={() => setPreviewModal(true)}>
                  Preview Ecard
                </button>
                <p id="help-text" className="pt-3">
                  Do you need{" "}
                  <Link href="/help-FAQs">
                    <u>help?</u>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div id="recommend-section">
          <h1>Recommended Cards</h1>
          <div className="row">{recommendCardList}</div>
        </div>
      </div>
      <FooterComponent />
    </main>
  );
};

export default connect((state) => ({
  cardDetailResponse: state.cardDetailResponse,
  recommendCardsResponse: state.recommendCardsResponse,
  favoriteCardCheckResponse: state.favoriteCardCheckResponse,
  favoriteCardToggleResponse: state.favoriteCardToggleResponse,
  profileResponse: state.profileResponse,
}))(ProductPage);
