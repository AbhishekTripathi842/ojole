import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useReducer, useState } from "react";
import VimeoPlayer from "react-player/vimeo";
import { getECardPickupItem } from "../../api/CardPickupAPI";
import FooterComponent from "../../components/common/footer";
import HeaderReply from "../../components/common/header-reply";
import Meta from "../../components/common/meta";
import { useCancelToken } from "../../shared/cancel-axios-request-hook";
import { initalState, reducer } from "../../shared/default-reducer";
import { parseErrorResponse } from "../../shared/response-error-parser";

function GuestReply() {
  const router = useRouter();
  const [greeting, setGreeting] = useState({});
  const [card, setCard] = useState({});

  const [isCancel, newCancelToken] = useCancelToken();
  const [itemState, itemDispatch] = useReducer(reducer, initalState);
  const [disableReply, setDisableReply] = useState(true);
  const [token, setToken] = useState("");
  useEffect(() => {
    if (!itemState.response.data) {
      loadEcardPickupItem();
    }
  }, []);

  useEffect(() => {
    if (
      itemState.success &&
      itemState.response.data &&
      itemState.response.data.data
    ) {
      let data = itemState.response.data.data;
      setCard(data.response.ecard ?? {});
      setGreeting(data ?? {});
      setDisableReply(
        !data.pickup_recipient_id || data.response.recipents[0].reply
      );
    }
  }, [itemState]);

  function loadEcardPickupItem() {
    let { pid } = router.query;
    if (!pid) return;

    itemDispatch({ type: "loading" });
    getECardPickupItem(pid, newCancelToken())
      .then((res) => {
        itemDispatch({
          type: "success",
          payload: {
            response: res,
          },
        });
      })
      .catch((error) => {
        if (isCancel(error)) return;
        itemDispatch({
          type: "error",
          payload: {
            message: parseErrorResponse(error),
          },
        });
      });
  }

  return (
    <main>
      <Head>
        <title>Reply</title>
        <Meta />
      </Head>
      <HeaderReply
        recipientId={
          greeting.pickup_recipient_id ? greeting.pickup_recipient_id : null
        }
        disableReply={disableReply}
        hideReply={() => setDisableReply(true)}
      />
      <div className="guest-reply-body">
        <div id="product-top-section">
          <div className="row">
            <div className="col-md-7">
              {/* <img id="product-img" src={card.thumbnail && card.thumbnail} /> */}
              <div className="video-container">
                <VimeoPlayer
                  url={`https://vimeo.com/${card.video}`}
                  width="100%"
                  height="100%"
                  controls
                  playsinline={true}
                />
              </div>
            </div>
            <div className="col-md-5">
              <div id="product-desc-div">
                <div
                  id="greeting-input"
                  dangerouslySetInnerHTML={{
                    __html: greeting.response && greeting.response.greeting,
                  }}
                ></div>
                <div
                  id="msg-input"
                  dangerouslySetInnerHTML={{
                    __html: greeting.response && greeting.response.message,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        {/*
        <button hidden={disableReply} onClick={() => setShowReply(true)}>
          Write Reply
        </button>
        */}
      </div>
      <FooterComponent />
    </main>
  );
}
export default GuestReply;
