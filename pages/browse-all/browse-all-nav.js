import Link from "next/link";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { CategoryAction } from "../../store/actions/category-action";

const BrowseAllNav = ({ dispatch, categoryResponse }) => {
  const [navState, setNavState] = useState({});

  useEffect(() => {
    dispatch(CategoryAction());
  }, []);

  useEffect(() => {
    categoryResponse.response.data
      ? categoryResponse.response.data.map((data) => {
          setNavState({ ...navState, [data.id]: false });
        })
      : null;
  }, [categoryResponse.response.data]);

  let category = categoryResponse.response.data
    ? categoryResponse.response.data.map((data) => (
        <div key={data.id}>
          <a href={`/cards/category/ ${data.slug}`} className="header-link">
            {data.name}
          </a>
          {data.children
            ? data.children.map((subData, index) => {
                if (index < 5) {
                  return (
                    <a
                      href={`/cards/category/${subData.slug}`}
                      key={subData.id}
                      className="sub-link"
                    >
                      {/* <a
                        key={subData.id}
                        href={{
                          pathname: "/cards/category/" + subData.slug,
                        }}
                        className="sub-link"
                      > */}
                      {subData.name}
                    </a>
                  );
                }
                if (navState[data.id]) {
                  if (index > 4) {
                    return (
                      <a
                        href={`/cards/category/${subData.slug}`}
                        key={subData.id}
                        scroll={false}
                        className="sub-link"
                      >
                        {/* <a
                          key={subData.id}
                          href={{
                            pathname: "/cards/category/" + subData.slug,
                          }}
                          className="sub-link"
                        > */}
                        {subData.name}
                      </a>
                    );
                  }
                } else {
                  if (index === 5) {
                    return (
                      <div
                        key={subData.id}
                        onClick={() =>
                          setNavState({ ...navState, [data.id]: true })
                        }
                        style={
                          navState[data.id]
                            ? { display: "none" }
                            : { cursor: "pointer" }
                        }
                      >
                        . . .
                      </div>
                    );
                  }
                }
              })
            : null}
        </div>
      ))
    : null;
  return (
    <div className="browse-all-nav">
      <div>
        <a href="/browse-all" scroll={false} className="header-link">
          ALL ECARDS
        </a>
        <a href="/cards/free" className="header-link">
          FREE ECARDS
        </a>
        <a href="/browse-all" scroll={false} className="header-link">
          NEW ECARDS
        </a>
        <a href="/cards/popular" scroll={false} className="header-link">
          POPULAR ECARDS
        </a>
      </div>
      {category}
    </div>
  );
};
export default connect((state) => ({
  categoryResponse: state.categoryResponse,
}))(BrowseAllNav);
