import Head from "next/head";
import { useEffect, useReducer, useRef, useState } from "react";
import BackToTop from "react-back-to-top-button";
import Carousel from "react-multi-carousel";
import { connect } from "react-redux";
import { getFreeCardsList } from "../../../api/CardsListAPI";
import CardList from "../../../components/cards/card-list";
import FooterComponent from "../../../components/common/footer";
import Header from "../../../components/common/header";
import Meta from "../../../components/common/meta";
import { useAPIRequestWithPayload } from "../../../shared/api-request-hook";
import { initalState, reducer } from "../../../shared/default-reducer";
import { PopularCardListAction } from "../../../store/actions/popular-cards-action";
import BrowseAllNav from "../../browse-all/browse-all-nav";
import PreviewCardModal from "../../browse-all/preview-modal";

const FreeCardsList = ({ dispatch, popularCardsListResponse }) => {
  const [showModal, setShowModal] = useState(false);
  const [cardData, setCardData] = useState("");
  const [cardList, setCardList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreTimer = useRef(null);
  const [cardListState, cardListDispatch] = useReducer(reducer, initalState);
  const [invokeGetCardList] = useAPIRequestWithPayload(
    cardListDispatch,
    getFreeCardsList
  );
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
    setCardList([]);
    setHasMore(true);

    invokeGetCardList({});

    return () => {
      if (loadMoreTimer.current) {
        clearTimeout(loadMoreTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    dispatch(PopularCardListAction());
    return () => {
      if (loadMoreTimer.current) {
        clearTimeout(loadMoreTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (cardListState.success && cardListState.response.data) {
      let dataList = cardListState.response.data.data ?? [];
      if (cardListState.response.data.meta.current_page > 1) {
        let mergedList = cardList.concat(dataList);
        setCardList(mergedList);
      } else {
        setCardList(dataList);
        setHasMore(dataList.length > 0);
      }
    } else if (cardListState.error) {
      setHasMore(false);
    }
  }, [cardListState]);

  const MoreCard = () => {
    if (!cardListState.response.data) {
      return;
    }

    if (
      cardListState.response.data.meta.current_page ===
      cardListState.response.data.meta.last_page
    ) {
      setHasMore(false);
      return;
    }

    let params = {
      page: cardListState.response.data.meta.current_page + 1,
    };

    loadMoreTimer.current = setTimeout(() => {
      invokeGetCardList(params);
    }, 500);
  };

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
          <label style={{ textTransform: "uppercase" }}>Free Ecards</label>
        </div>
        <div className="browse-filter-container">
          Filter by:
          <img src="/assets/image/filter-icon.svg" />
        </div>
        <div className="browse-filter-result">
          Results{" "}
          {cardListState.response.data
            ? cardListState.response.data.meta.total
            : 0}
        </div>
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
          <CardList
            cardList={cardList}
            moreCard={MoreCard}
            hasMore={hasMore}
            setCardData={setCardData}
            setShowModal={setShowModal}
          />
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
          removeArrowOnDeviceType={["tablet", "mobile"]}
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
  popularCardsListResponse: state.popularCardsResponse,
}))(FreeCardsList);
