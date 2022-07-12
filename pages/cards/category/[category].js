import { useEffect, useReducer, useRef, useState } from "react";
import BrowseAllNav from "../../browse-all/browse-all-nav";
import BackToTop from "react-back-to-top-button";
import Carousel from "react-multi-carousel";
import PreviewCardModal from "../../browse-all/preview-modal";
import Head from "next/head";
import Header from "../../../components/common/header";
import Meta from "../../../components/common/meta";
import FooterComponent from "../../../components/common/footer";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { PopularCardListAction } from "../../../store/actions/popular-cards-action";
import { initalState, reducer } from "../../../shared/default-reducer";
import { useAPIRequestWithPayload } from "../../../shared/api-request-hook";
import { getCardsList } from "../../../api/CardsListAPI";
import { CategoryDetailAction } from "../../../store/actions/category-detail-action";
import CardList from "../../../components/cards/card-list";

const CardsByCategory = ({
  dispatch,
  popularCardsListResponse,
  categoryDetailResponse,
}) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [cardData, setCardData] = useState("");
  const [cardList, setCardList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreTimer = useRef(null);
  const [category, setCategory] = useState("");
  const [cardListState, cardListDispatch] = useReducer(reducer, initalState);
  const [invokeGetCardList] = useAPIRequestWithPayload(
    cardListDispatch,
    getCardsList
  );
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
    if (categoryDetailResponse.success) {
      setCategory(categoryDetailResponse.response.data);
    }
  }, [categoryDetailResponse]);

  useEffect(() => {
    setCardList([]);
    setHasMore(true);

    let { category } = router.query;
    dispatch(CategoryDetailAction(category));

    if (!category) {
      return;
    }

    let params = { ecard_category_slug: category };

    invokeGetCardList(params);

    return () => {
      if (loadMoreTimer.current) {
        clearTimeout(loadMoreTimer.current);
      }
    };
  }, [router.query]);

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

    let { category } = router.query;

    if (!category) {
      return;
    }

    let params = {
      ecard_category_slug: category,
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
        <title>{category.name}</title>
        <Meta />
      </Head>
      <Header tokenData={(data)=>setToken(data)} />
      <div className="browse-all">
        <div
          className="browse-all-head"
          style={{
            backgroundImage: `url(${category.header_image})`,
            backgroundColor: `${category.header_color}`,
            backgroundRepeat: `round`,
          }}
        >
          <label style={{ textTransform: "uppercase" }}>{category.name}</label>
          <p>{category.header_descripion}</p>
          <p
            style={{
              textTransform: "uppercase",
              textDecoration: "underline",
              fontSize: "19px",
              cursor: "pointer",
              textAlign:"center"
            }}
            onClick={() => router.push("/pricing")}
          >
            LEARN ABOUT THE BENEFITS OF MEMBERSHIP
          </p>
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
          {/* <div className="browse-all-body-right-column">{list}</div> */}
          {/* <InfiniteScroll
            className="browse-all-body-right-column"
            dataLength={cardList.length}
            next={MoreCard}
            hasMore={hasMore}
            loader={<h4 style={{ textAlign: "center" }}>Loading...</h4>}
          >
            {list}
          </InfiniteScroll> */}
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
          removeArrowOnDeviceType={["mobile"]}
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
  categoryDetailResponse: state.categoryDetailResponse,
}))(CardsByCategory);
