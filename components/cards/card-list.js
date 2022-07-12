import InfiniteScroll from "react-infinite-scroll-component";
import { useState } from "react";
import Link from "next/link";
import ShowMoreText from "react-show-more-text";


function CardList({ cardList, moreCard, hasMore, setCardData, setShowModal }) {
  const [state, setState] = useState({});

  let list = cardList.map((data) => (
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
        <div className="hovered-div">
          <div>
            <img src={`${data.thumbnail}`} />
            <label>{data.caption}</label>
            {parseInt(data.private) === 1 ? (
              <p>
                <img src="/assets/image/diamond-solid.svg" id="diamond-img" />
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
          <label>{data.caption}</label>
          { parseInt(data.private) === 1 ? (
            <p>
              <img src="/assets/image/diamond-solid.svg" id="diamond-img" />
              PREMIUM
            </p>
          ) : (
            <p>FREE</p>
          )}
        </div>
      )}
    </div>
  ));

  return (
    <InfiniteScroll
      className="browse-all-body-right-column"
      dataLength={cardList.length}
      next={moreCard}
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
  );
}

export default CardList;
