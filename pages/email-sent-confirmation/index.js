import Head from "next/head";
import Link from "next/link";
import Header from "../../components/common/header";
import Meta from "../../components/common/meta";
import { useEffect, useState } from "react";
import FooterComponent from "../../components/common/footer";
import { useRouter } from "next/router";
import { ResetSaveECardItemAction } from "../../store/actions/save-ecard-item-action";
import { connect } from "react-redux";
import withAuthentication from "../../shared/authenticated-component";
import { SEND_CARD_DATA } from "../create-card";

const EmailSentConfirmationPage = ({ dispatch, saveECardItemResponse }) => {
  const router = useRouter();
  const [sendCardData, setSendCardData] = useState({});
  const [token, setToken] = useState("");
  useEffect(() => {
    let value = window.sessionStorage.getItem(SEND_CARD_DATA);
    if (!value) {
      router.replace("/browse-all");
      return;
    }

    let data = JSON.parse(value);

    setSendCardData(data);

    dispatch(ResetSaveECardItemAction());
    return () => {
      window.sessionStorage.removeItem(SEND_CARD_DATA);
    };
  }, []);

  return (
    <main>
      <Head>
        <title>Email</title>
        <Meta />
      </Head>
      <Header tokenData={(data)=>setToken(data)} />
      <div className="email-sent-body">
        <div className="email-sent-section">
          <h1>Your card has been sent</h1>
          <p>
            You can find your card in <Link href="/my-cards">card history</Link>
            . <br />
            <span className="span-2">
              To send to more recipients or share in other ways, use the button
              below.
            </span>
          </p>
          <button
            onClick={() => {
              router.replace({
                pathname: "/product",
                query: { id: sendCardData.id },
              });
            }}
          >
            See more
          </button>
        </div>
      </div>
      <FooterComponent />
    </main>
  );
};

export default withAuthentication(
  connect((state) => ({
    saveECardItemResponse: state.saveECardItemResponse,
  }))(EmailSentConfirmationPage)
);
