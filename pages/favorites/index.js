import { useEffect, useState } from "react";
import BackToTop from "react-back-to-top-button";
import Carousel from "react-multi-carousel";
import Head from "next/head";
import Link from "next/link";
import Header from "../../components/common/header";
import Meta from "../../components/common/meta";
import Image from "next/image";
import FooterComponent from "../../components/common/footer";
import { connect } from "react-redux";
import { FavoriteListAction } from "../../store/actions/favorite-cards-list-action";
import authenticatedRoute from "../../components/authenticateRoute";
import { useRouter } from "next/router";

const Favorites = ({ dispatch, favoriteCardsResponse }) => {
  const router = useRouter();
  const [state, setState] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [cardData, setCardData] = useState("");
  const [token, setToken] = useState("");
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };

  useEffect(() => {
    dispatch(FavoriteListAction());
  }, []);

  let ary = favoriteCardsResponse.response.data
    ? favoriteCardsResponse.response.data
    : [];
  let list = ary.map((data, index) => (
    <div
      className="card-div"
      key={index}
      onClick={() => {
        router.push({
          pathname: "/product",
          query: { id: data.id },
        });
      }}
    >
      <img src={data.thumbnail} />
      <div className="unhovered-div">
        <label>{data.caption}</label>
        {data.private == 1 ? (
          <p>
            <img src="/assets/image/diamond-solid.svg" id="diamond-img" />
            PREMIUM
          </p>
        ) : (
          <p>FREE</p>
        )}
      </div>
    </div>
  ));

  return (
    <main>
      <Head>
        <title>Favorites</title>
        <Meta />
      </Head>
      <Header tokenData={(data)=>setToken(data)} />
      <div className="favorites-page-wrapper">
        <div className="favorites-head">
          <label>My Favorite Cards</label>
          <p>{ary.length} results</p>
        </div>

        <div className="favorites-body">
          <BackToTop
            showOnScrollUp={true}
            showAt={100}
            speed={1500}
            easing="easeInOutQuint"
          >
            <img src="/assets/image/up_button.png" />
          </BackToTop>

          <div className="favorites-card-list">{list}</div>
        </div>
      </div>
      <FooterComponent />
    </main>
  );
};
export default authenticatedRoute(
  connect((state) => ({
    favoriteCardsResponse: state.favoriteCardsResponse,
  }))(Favorites)
);
