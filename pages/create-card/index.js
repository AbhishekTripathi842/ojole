import Breadcrumb from "react-bootstrap/Breadcrumb";
import Head from "next/head";
import Link from "next/link";
import Header from "../../components/common/header";
import Meta from "../../components/common/meta";
import { useEffect, useReducer, useRef, useState } from "react";
import FooterComponent from "../../components/common/footer";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { CardDetailAction } from "../../store/actions/card-detail-action";
import VimeoPlayer from "react-player/vimeo";
import { initalState, reducer } from "../../shared/default-reducer";
import { useAPIRequestWithPayload } from "../../shared/api-request-hook";
import {
  createDraftSendCard,
  updateDraftSendCard,
} from "../../api/SendCardAPI";
import AuthenticatedRoute from "../../components/authenticateRoute";
import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import {
  align,
  font,
  fontSize,
  fontColor,
  hiliteColor,
  horizontalRule,
  list,
  table,
  formatBlock,
} from "suneditor/src/plugins";
// import font from 'suneditor/src/plugins'
import { Editor } from "@tinymce/tinymce-react";
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});
// const Editor = dynamic(
//   () => import('@tinymce/tinymce-react').then((mod) => mod.Editor),
//   { ssr: false },
// );
// const IProps = dynamic(
//   () => import('@tinymce/tinymce-react').then((mod) => mod.default),
//   { ssr: false },
// );

export const SEND_CARD_DATA = "send_card_info";
let customFont = [
  "Alex Brush",
  "Corben",
  "Dancing Script",
  "Josefin Slab",
  "Niconne",
  "Parisienne",
  "Petit Formal Script",
  "Philosopher",
  "Pinyon Script",
  "Playfair Display SC",
  "Poiret One",
  "Raleway",
  "Rochester",
  "Sacramento",
  "Satisfy",
  "Open Sans",
  "Amiri",
  "Quicksand",
];
let fontFormat =
  "AlexBrush-Regular=AlexBrush-Regular;Corben-Regular=Corben-Regular;Dancing Script=Dancing Script;JosefinSlab-Regular=JosefinSlab-Regular;Niconne-Regular=Niconne-Regular;Parisienne-Regular=Parisienne-Regular;petitformalscript-regular-webfont=petitformalscript-regular-webfont;Philosopher-Regular=Philosopher-Regular;Pinyon Script=PinyonScript-Regular;PlayfairDisplaySC-Regular=PlayfairDisplaySC-Regular;PoiretOne-Regular=PoiretOne-Regular;Raleway-Regular=Raleway-Regular;Rochester-Regular=Rochester-Regular;Sacramento-Regular=Sacramento-Regular;Satisfy-Regular=Satisfy-Regular;OpenSans-Regular=OpenSans-Regular;Amiri-Regular=Amiri-Regular;Quicksand-Regular=Quicksand-Regular;MarketingScript=MarketingScript;slick=slick;";
const CreateCard = ({
  dispatch,
  cardDetailResponse,
  draftECardSendItemResponse,
  saveECardItemResponse,
}) => {
  const [greeting, setGreeting] = useState("");
  const [msg, setMsg] = useState("");
  const editorRef = useRef();
  const editorRefDesc = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [sendCardData, setSendCardData] = useState({});
  const [draftState, dispatchDraft] = useReducer(reducer, initalState);
  const [invokeSaveDraft] = useAPIRequestWithPayload(
    dispatchDraft,
    createDraftSendCard
  );

  const [invokeUpdateDraft] = useAPIRequestWithPayload(
    dispatchDraft,
    updateDraftSendCard
  );
  const [token, setToken] = useState("");
  const router = useRouter();

  const titleEditorFocus = () => {
    if (editorRef.current) {  
        editorRef.current.focus()      
    }
  };

  const descEditorFocus= ()=>{
    if (editorRef.current) {  
          editorRefDesc.current.focus()
    }
  }
  
  useEffect(() => {
    let value = window.sessionStorage.getItem(SEND_CARD_DATA);
    if (!value) {
      router.replace("/browse-all");
      return;
    }

    try {
      let data = JSON.parse(value);
      if (!data.id) {
        throw Error();
      }

      setSendCardData(data);

      setGreeting(data.greeting ?? "");
      setMsg(data.message ?? "");
      dispatch(CardDetailAction(data.id));
    } catch {
      window.sessionStorage.removeItem(SEND_CARD_DATA);
      router.replace("/browse-all");
      return;
    }
  }, []);

  useEffect(() => {
    let detail = cardDetailResponse.response.data;
    if (!cardDetailResponse.success) {
      return;
    }
    let value = window.sessionStorage.getItem(SEND_CARD_DATA);
    let data;
    try {
      data = JSON.parse(value);
    } catch {}

    if (data && !data.greeting) {
      setGreeting(detail.template_detail.template_title);
    }
    if (data && !data.message) {
      setMsg(detail.template_detail.template_content);
    }
  }, [cardDetailResponse]);

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  useEffect(() => {
    if (draftState.success && draftState.response.data.data) {
      let result = draftState.response.data.data.response;

      console.log(result)
      let data = { ...sendCardData };

      data["greeting"] = result.greeting;
      data["message"] = result.message;
      data["draft_id"] = result.id;
      data["pickup_noti"] = result.pickup_noti;

      window.sessionStorage.setItem(SEND_CARD_DATA, JSON.stringify(data));

      setSendCardData(data);

      let value = window.sessionStorage.getItem(SEND_CARD_DATA);
      let new_data = JSON.parse(value);
      new_data["id"] = result.ecard.id
      data["greeting"] = greeting;
      data["message"] = msg;
  
      window.sessionStorage.setItem(
        SEND_CARD_DATA,
        JSON.stringify(new_data)
      );

      router.push({
        pathname: "/send-ecard",
      });    
    }
  }, [draftState]);

  function draftEcardSendItem() {
    if (draftState.loading) {
      return;
    }
    
    let data = {
      id: sendCardData.draft_id,
      ecard_id: sendCardData.id,
      greeting: greeting,
      message: msg,
      pickup_noti: 1,
      draft: 1,
    };

    if (data.id && data.id > 0) {
      invokeUpdateDraft(data);
    } else {
      invokeSaveDraft(data);
    }
  }

  const draftEcardSaveAndSendItem = () =>{
      //console.log('draftEcardSaveAndSendItem')
      
      let data_save= {
        id: 0,
        ecard_id: sendCardData.id,
        greeting: greeting,
        message: msg,
        pickup_noti: 1,
        draft: 1,
      };

      invokeSaveDraft(data_save);

      console.log(draftState)
      
        /* let value = window.sessionStorage.getItem(SEND_CARD_DATA);
        let data = JSON.parse(value);
        data["id"] = draftState.id
        data["greeting"] = greeting;
        data["message"] = msg;
    
        window.sessionStorage.setItem(
          SEND_CARD_DATA,
          JSON.stringify(data)
        );
  
          router.push({
            pathname: "/send-ecard",
          });  */   
  }

  let cardDetail = cardDetailResponse.response.data;

  return (
    <main>
      <Head>
        <title>Home</title>
        <Meta />
      </Head>
      <Header tokenData={(data)=>setToken(data)} />
      <div className="create-card-body">
        <div className="create-card-head-div">
          <div id="product-menu" style={{ padding: "0", width: "80%" }}>
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
          <div className="create-card-head-action-div">
            <Link
              href={{
                pathname: "/product",
                query: { id: sendCardData.id },
              }}
            >
              <img src="/assets/image/back-circle.svg" />
            </Link>
            <img
              src="/assets/image/save-circle.svg"
              onClick={draftEcardSendItem}
              role="button"
            />
            <img
              src="/assets/image/next-circle.svg"
              onClick={() => {
                let value = window.sessionStorage.getItem(SEND_CARD_DATA);
                let data = JSON.parse(value);
                data["greeting"] = greeting;
                data["message"] = msg;
                window.sessionStorage.setItem(
                  SEND_CARD_DATA,
                  JSON.stringify(data)
                );
                router.push({
                  pathname: "/send-ecard",
                });
              }}

              //onClick={draftEcardSaveAndSendItem}
            />
          </div>
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
                <div>
                  {/* <SunEditor
                    setContents={greeting}
                    onChange={setGreeting}
                    setOptions={{
                      height: "auto",
                      font: customFont,
                      plugins: [
                        align,
                        font,
                        fontSize,
                        fontColor,
                        hiliteColor,
                        horizontalRule,
                        list,
                        table,
                        formatBlock,
                      ],
                      buttonList: [
                        ["font", "fontSize", "formatBlock"],
                        ["fontColor", "hiliteColor"],
                        ["align", "horizontalRule", "list", "table"],
                      ],
                      mode: "inline",
                      popupDisplay: "local"
                    }}
                  /> */}
                   {/* <button className="btn pull-right" onClick={titleEditorFocus}>Edit<i className="fa fa-edit"></i></button> */}
                  <Editor
                   apiKey='r1qjqnhf7vgc7pmk7op3j4eos9bdmcpk9twi6anoud2m4u5a'
                    onInit={(evt, editor) => editorRef.current = editor}
                    value={greeting}
                    init={{
                      fontSize,
                      font_formats: fontFormat,
                      inline: true,
                      menubar: false,
                      height : "auto",
                      content_style: ".tox-tinymce-inline { margin-top : -10px; }",
                      /* toolbar1: "fontselect | fontsizeselect | forecolor",
                      toolbar2: "bold italic | alignleft aligncenter alignright alignjustify" */
                      toolbar: "fontselect | fontsizeselect | forecolor | bold italic underline |  alignleft aligncenter alignright alignjustify | lineheight | backcolor",
                    }}
                    onEditorChange={(data) => setGreeting(data)}
                  />
                  {/* <button className="btn" onClick={descEditorFocus}>Edit<i className="fa fa-edit"></i></button> */}
                  <Editor
                    apiKey='r1qjqnhf7vgc7pmk7op3j4eos9bdmcpk9twi6anoud2m4u5a'
                    onInit={(evt, editor) => editorRefDesc.current = editor}
                    inline={true}
                    value={msg}
                    id = "second_editor"
                    init={{
                      fontSize,
                      font_formats: fontFormat,
                      inline: true,
                      menubar: false,
                      content_style: "#second_editor { margin-top: 60px }",
                      toolbar: "fontselect | fontsizeselect | forecolor | bold italic underline |  alignleft aligncenter alignright alignjustify | lineheight | backcolor",
                      /* toolbar2: "bold italic | alignleft aligncenter alignright alignjustify" */
                    }}
                    onEditorChange={(data) => setMsg(data)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
    </main>
  );
};
export default AuthenticatedRoute(
  connect((state) => ({
    cardDetailResponse: state.cardDetailResponse,
    draftECardSendItemResponse: state.draftECardSendItemResponse,
    saveECardItemResponse: state.saveECardItemResponse,
  }))(CreateCard)
);
