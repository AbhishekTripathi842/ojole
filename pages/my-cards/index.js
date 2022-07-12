import React, { useEffect, useReducer, useState } from "react";
import Head from "next/head";
import Header from "../../components/common/header";
import FooterComponent from "../../components/common/footer";
import ProfileMenu from "../../components/common/profile-menu";
import MyCardsMenu from "../../components/common/mycards-menu";
import ShareModal from "../../components/common/share-modal";
import ReciepentListModal from "../../components/common/recipient-list-model";
import { useRouter } from "next/router";
import { reducer, initalState } from "../../shared/default-reducer";
import { deleteECardSentItem, getECardSentItems } from "../../api/MyCardsAPI";
import Cookies from "universal-cookie";
import { useAPIRequestWithPayload } from "../../shared/api-request-hook";
import Link from "next/link";
import withAuthentication from "../../shared/authenticated-component";
import { SEND_CARD_DATA } from "../create-card";
import InfiniteScroll from "react-infinite-scroll-component";
import { ECardSendItemDetailAction } from "../../store/actions/ecard-send-item-detail-action";
import { connect } from "react-redux";

const cookies = new Cookies();
const SentScheduledPage = ({ dispatch, ECardSendItemResponse }) => {
  //console.log(ECardSendItemResponse, "RESPONSE")
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState({ type: "sent",filter:'' ,id :'', page: 1 });
  const [list, setList] = useState({});
  const [searchKeyword,setSearchKeyword] = useState('');
  const [updateList,setUpdateList]=useState(false)
  // const [state, dispatch] = useReducer(reducer, initalState);
  // const [loadCards] = useAPIRequestWithPayload(dispatch, getECardSentItems);
  const [shareModal, setShareModal] = useState(false);
  const [cardDetail, setCardDetail] = useState({});
  const [shareReciepientListModal, setShareReciepientListModal] = useState(false);
  const [recpeintList,setRecpeintList] = useState([])
  const [socialShare,setSocialShare] = useState(false)
  const [deleteState, dispatchDelete] = useReducer(reducer, initalState);
  const [tabname,setTabName]=useState('');
  const [hasMore, setHasMore] = useState(true);
  const [invokeDelete] = useAPIRequestWithPayload(
    dispatchDelete,
    deleteECardSentItem
  );
  const [token, setToken] = useState("");
  useEffect(() => {
    if (!cookies.get("email")) {
      router.replace({ pathname: "/home" });
      return;
    }

    let tab = "sent";
    switch (router.query.tab) {
      case "1":
        tab = "drafted";
        break;
      case "2":
        tab = "received";
        break;
      case "3":
        tab = "archived";
        break;
    }
    setTabName(tab)
    let page = router.query.page ? parseInt(router.query.page) : 1;

    setCurrentPage(page);

    setMeta({ type: tab,filter:searchKeyword, page: page ,id:'' });
  }, [router.query]);

  useEffect(() => {
    if (meta.type == "archived") {
      setList({});
    } else {
      if(!!searchKeyword){
        meta.filter=searchKeyword
      }else{
        meta.filter=''
      }
      // console.log('loadCards')
      dispatch(ECardSendItemDetailAction(meta));
    }
  }, [router.query]);

  useEffect(() => {
    if (ECardSendItemResponse.success && ECardSendItemResponse.response.data) { 
      let temp = list.data ? list.data : [];
      console.log(ECardSendItemResponse.response.data)
      var newArray = temp.concat(ECardSendItemResponse.response.data);
      if(updateList){
        let temp = list.data ? list.data : [];
        var newArray =  temp.map(obj => ECardSendItemResponse.response.data.find(o => o.id === obj.id) || obj);
        setList({ ...list, data: newArray });
        setUpdateList(false)
      }else{
        setList({ ...list, data: newArray, links: ECardSendItemResponse.response.links, meta: ECardSendItemResponse.response.meta });
      }
    }
  }, [ECardSendItemResponse]);

  useEffect(() => {
    if (deleteState.success) {
      dispatch(ECardSendItemDetailAction(meta));
      dispatchDelete(initalState);
    }
  }, [deleteState]);

  function handleEditClick(data) {
    switch (router.query.tab) {
      case "1":
        let draftData = {
          id: data.ecard.id,
          draft_id: data.id,
          greeting: data.greeting,
          message: data.message,
          pickup_noti: data.pickup_noti,
          draft: data.draft,
        };
        window.sessionStorage.setItem(
          SEND_CARD_DATA,
          JSON.stringify(draftData)
        );
        router.push({ pathname: "/create-card" });
        break;
      default:
        window.sessionStorage.setItem(
          SEND_CARD_DATA,
          JSON.stringify({ id: data.ecard.id })
        );
        router.push({ pathname: "/create-card" });
        break;
    }
  }

  function handleDeleteClick(data) {
   // console.log(data.draft)
   // console.log(data.draft !== 1)
    if (data.draft !== 1) {
      return;
    }
    let result = confirm("Are you sure to delete?");
    if (result) {
      invokeDelete(data.id);
    }
  }

  const showRecipents = (data,social_share) =>{
    //console.log(data)
    setRecpeintList(data)
    setSocialShare(social_share)
    setShareReciepientListModal(true)
  }

  const MoreCard = () => {
    if (ECardSendItemResponse?.response) {
      if (
        ECardSendItemResponse?.response.meta?.current_page === ECardSendItemResponse?.response.meta?.last_page
      ) {
        setHasMore(false);
        return;
      }
    }
    setTimeout(() => {
      dispatch(ECardSendItemDetailAction({ type: "sent", filter: '', page: ECardSendItemResponse.response.meta.current_page + 1 ,id:'' }));
    }, 500);
  };

  const getUpdateData = (cardid)=>{ console.log('ss'); console.log(meta)
      setUpdateList(true)
      dispatch(ECardSendItemDetailAction({ type: "sent", filter: '',id: cardid ,page:1 }));
  }

  return (
    <main>
      <ShareModal
        getUpdateData={getUpdateData}
        showModal={shareModal}
        handleClose={() => setShareModal(false)}
        data={cardDetail}
      />
      <ReciepentListModal showModal={shareReciepientListModal}  handleClose={() => setShareReciepientListModal(false)} data={recpeintList} socialShare={socialShare}></ReciepentListModal>
      <Head>
        <title>My Cards</title>
      </Head>
      <Header tokenData={(data)=>setToken(data)} />

      <div className="sentscheduled-wrapper">
        <div className="sentscheduled-container">
          <div className="row m-0">
            <div className="menu-section col-xl-3 p-0">
              <ProfileMenu tab="my-cards" name="My Cards" />
              
            </div>
            <div className="main-section col-xl-9 col-sm-12 p-0">
              <div className="row">
                <div className="col-md-8">
              <MyCardsMenu
                tab={router.query.tab ?? 0}
                page={router.query.page}
              />
              </div>
              <div className="col-md-4">
              <div className="input_outer my--cards--search">
                  <input type="" placeholder="Search your cards" className="form-control" value={searchKeyword} onChange={(e)=>setSearchKeyword(e.target.value) }/>
                  <span className="search_icon"><svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.32 17.4238C3.712 17.4238 0 13.6206 0 8.89942C0 4.1782 3.712 0.375 8.32 0.375C12.928 0.375 16.64 4.1782 16.64 8.89942C16.64 13.6206 12.928 17.4238 8.32 17.4238ZM8.32 1.68645C4.416 1.68645 1.28 4.8995 1.28 8.89942C1.28 12.8993 4.416 16.1124 8.32 16.1124C12.224 16.1124 15.36 12.8993 15.36 8.89942C15.36 4.8995 12.224 1.68645 8.32 1.68645Z" fill="black"/>
                    <path d="M14.5163 14.3188L20.2635 20.2072L19.3585 21.1344L13.6113 15.246L14.5163 14.3188Z" fill="black"/>
                    </svg>
                  </span> 
                  </div>
              </div>
              </div>
              <InfiniteScroll
                className="browse-all-body-right-column"
                dataLength={list.data ? list.data.length : 0}
                next={() => MoreCard()}
                hasMore={hasMore}
                loader={<h4 style={{ textAlign: "center" }}>Loading...</h4>}
              >
                {list.data &&
                list.data.map((e) => {
                  return (
                    <div className="product-card" key={e.id}>
                      <img src={e.ecard.thumbnail} />
                      <div className="product-card-body">
                        <div className="card-heading">
                          <h1>{e.ecard.caption}</h1>
                          { !e.scheduled_date ?
                          <p>
                            {tabname.charAt(0).toUpperCase()+ tabname.slice(1)} on &nbsp;
                            {new Date(e.created_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </p>
                          : <p>Scheduled for &nbsp;
                          {new Date(e.scheduled_date).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}</p>}
                        </div>
                        <div className="card-properties">
                          <div className="email-sent" onClick={()=>showRecipents(e.recipents,e.social_share)}>
                            <img src="/assets/image/mail-close.svg" />
                            <p>{e.total_sent}</p>
                          </div>
                          <div className="email-open" >
                            <img src="/assets/image/mail-open.svg" />
                            <p>
                              {e.recipents
                                .map((d) => parseInt(d.count_view))
                                .reduce((p, c) => p + c, 0)}
                              &nbsp;Opened
                            </p>
                           </div>
                        </div>
                        <div className="card-button">
                          <div
                            className="button-container"
                            onClick={() => {
                              setShareModal(true);
                              setCardDetail(e);    
                            }}
                          >
                            <div className="icon">
                              <img src="/assets/image/share-icon.svg" />
                            </div>
                            <label>Share</label>
                          </div>
                          <div className="button-container">
                            <div
                              className="icon"
                              onClick={() => {
                                router.push({
                                  pathname: "/product",
                                  query: { id: e.ecard.id },
                                });
                              }}
                            >
                              <img src="/assets/image/view-icon.svg" />
                            </div>
                            <label>View</label>
                          </div>
                          {meta.type === "drafted" ? (
                            <div className="button-container">
                              <div
                                className="icon"
                                role="button"
                                onClick={() => handleDeleteClick(e)}
                              >
                                <img src="/assets/image/trash-icon.svg" />
                              </div>
                              <label>Delete</label>
                            </div>
                          ) : null}

                          <div className="button-container">
                            <div
                              className="icon"
                              role="button"
                              onClick={() => handleEditClick(e)}
                            >
                              <img src="/assets/image/pencil-icon.svg" />
                            </div>
                            <label>Edit</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </InfiniteScroll>


              {/* {list.data && list.meta.total > 1 && (
                <div className="d-flex mt-4">
                  <nav className="ms-auto">
                    <ul className="pagination">
                      <li
                        className={
                          "page-item" + (currentPage > 1 ? "" : " disabled")
                        }
                      >
                        <Link
                          href={{
                            pathname: "/my-cards",
                            query: {
                              tab: router.query.tab ?? 0,
                              page: currentPage - 1,
                            },
                          }}
                        >
                          <a className="page-link" href="#">
                            Prev
                          </a>
                        </Link>
                      </li>
                      <li
                        className={
                          "page-item" +
                          (currentPage * list.meta.per_page < list.meta.total
                            ? ""
                            : " disabled")
                        }
                      >
                        <Link
                          href={{
                            pathname: "/my-cards",
                            query: {
                              tab: router.query.tab ?? 0,
                              page: currentPage + 1,
                            },
                          }}
                        >
                          <a className="page-link" href="#">
                            Next
                          </a>
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
    </main>
  );
}

export default connect((state) => ({
  ECardSendItemResponse: state.ecardSendItemDetailResponse
}))(withAuthentication(SentScheduledPage));
