import { useEffect, useState } from "react";
import BrowseAllNav from "./browse-all-nav";
import BackToTop from "react-back-to-top-button";
import Carousel from "react-multi-carousel";
import PreviewCardModal from "./preview-modal";
import Head from "next/head";
import Header from "../../components/common/header";
import Meta from "../../components/common/meta";
import FooterComponent from "../../components/common/footer";
import { connect } from "react-redux";
import { CardListAction } from "../../store/actions/cards-list-action";
import { useRouter } from "next/router";
import { PopularCardListAction } from "../../store/actions/popular-cards-action";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";

const BrowseAll = ({
  dispatch,
  cardsListResponse,
  popularCardsListResponse,
}) => {
  const router = useRouter();
  const [state, setState] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [cardData, setCardData] = useState("");
  const [cardList, setCardList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [token, setToken] = useState("");
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

  useEffect(() => {
    let params = {};
    if (router.query.search) {
      params["search"] = router.query.search;
    }
    // if (router.query.category) {
    //   params["ecard_category_slug"] = router.query.category;
    // }
    if (router.query.private) {
      params["private"] = router.query.private;
    }
    dispatch(CardListAction(params, 1));
  }, [router.query]);

  useEffect(() => {
    if (cardsListResponse.success) {
      let temp = cardList;
      let newAry = temp.concat(cardsListResponse.response.data);
      setCardList(newAry);
    }
  }, [cardsListResponse]);

  useEffect(() => {
    setCardList([]);
    dispatch(PopularCardListAction());
  }, []);

  const MoreCard = () => {
    if (cardsListResponse.response) {
      if (
        cardsListResponse.response.meta.current_page ===
        cardsListResponse.response.meta.last_page
      ) {
        setHasMore(false);
        return;
      }
    }

    let params = {};
    if (router.query.search) {
      params["search"] = router.query.search;
    }
    // if (router.query.category) {
    //   params["ecard_category_slug"] = router.query.category;
    // }
    if (router.query.private) {
      params["private"] = router.query.private;
    }
    setTimeout(() => {
      dispatch(
        CardListAction(params, cardsListResponse.response.meta.current_page + 1)
      );
    }, 500);
  };

  let list =
    cardList.length !== 0
      ? cardList.map((data) => (
          <div
            key={data.id}
            className="card-div"
            onMouseEnter={() => setState({ [data.id]: true })}
            onMouseLeave={() => setState({ [data.id]: false })}
            onClick={(e) => {
              e.preventDefault();
              setCardData(data);
              setShowModal(true);
            }}
          >
            <img src={`${data.thumbnail}`} />
            {state[data.id] ? (
              <div className="hovered-div" style={{ zIndex: "2" }}>
                <div>
                  <img src={`${data.thumbnail}`} />
                  <label>{data.caption}</label>
                  {data.private == '1' ? (
                    <p>
                      <img
                        src="/assets/image/diamond-solid.svg"
                        id="diamond-img"
                      />
                      PREMIUM
                    </p>
                  ) : (
                    <p>FREE</p>
                  )}

                  <p className="card-description">{data.detail}</p>
                  <Link
                    className="d-flex align-items-center justify-content-center"
                    href={{
                      pathname: "/product",
                      query: { id: data.id },
                    }}
                  >
                    <a>
                      <button>Customize Ecard</button>
                    </a>
                  </Link>
                  <button
                    className="d-flex align-items-center justify-content-center mb-5"
                    onClick={() => {
                      setShowModal(true);
                      setCardData(data);
                    }}
                  >
                    Preview
                  </button>
                </div>
              </div>
            ) : (
              <div className="unhovered-div">
                <label>{data.caption}{data.private}</label>
                {data.private =='1' ? (
                  <p>
                    <img
                      src="/assets/image/diamond-solid.svg"
                      id="diamond-img"
                    />
                    PREMIUM
                  </p>
                ) : (
                  <p>FREE</p>
                )}
              </div>
            )}
          </div>
        ))
      : null;

  let popularCardList = popularCardsListResponse.response.data
    ? popularCardsListResponse.response.data.map((data) => (
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
  return (
    <main>
      <Head>
        <title>Browse All</title>
        <Meta />
      </Head>
      <Header tokenData={(data)=>setToken(data)} />
      <div className="browse-all">
        <div className="browse-all-head">
          <label>Browse All</label>
        </div>
        <div className="browse-filter-container">
          Filter by:
          <img src="/assets/image/filter-icon.svg" />
        </div>
        <div className="browse-filter-result">Results {cardList.length}</div>
        <PreviewCardModal
          showModal={showModal}
          handleClose={() => setShowModal(false)}
          data={cardData}
        />
        <div className="browse-all-body">
          <BackToTop
            showOnScrollUp={true}
            showAt={100}
            speed={1500}
            easing="easeInOutQuint"
          >
            <img src="/assets/image/up_button.png" />
          </BackToTop>
          <div className="browse-all-body-left-column">
            <BrowseAllNav />
          </div>
          {/* <div className="browse-all-body-right-column">{list}</div> */}
          <InfiniteScroll
            className="browse-all-body-right-column"
            dataLength={cardList.length}
            next={() => MoreCard()}
            hasMore={hasMore}
            loader={<h4 style={{ textAlign: "center" }}>Loading...</h4>}
          >
            {list}
            <div className="card-div extra-card">
              <p>
                <img src="/assets/image/diamond-solid.svg" id="diamond-img" />
                PREMIUM
              </p>
            </div>
          </InfiniteScroll>
        </div>
      </div>
      <div className="carousel-div">
        <h3>Popular Cards</h3>
        <Carousel
          swipeable={false}
          draggable={false}
          showDots={false}
          responsive={responsive}
          ssr={true} // means to render carousel on server-side.
          infinite={true}
          autoPlaySpeed={1000}
          keyBoardControl={true}
          customTransition="all .5"
          transitionDuration={500}
          containerClass="carousel-container"
          // removeArrowOnDeviceType={["tablet", "mobile"]}
          dotListClass="custom-dot-list-style"
          itemClass="carousel-item-padding-40-px"
        >
          {popularCardList}
        </Carousel>
      </div>
      <FooterComponent />
    </main>
  );
};
export default connect((state) => ({
  cardsListResponse: state.cardsResponse,
  popularCardsListResponse: state.popularCardsResponse,
}))(BrowseAll);
