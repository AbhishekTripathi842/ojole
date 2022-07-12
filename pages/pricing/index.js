import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "../../components/common/header";
import Meta from "../../components/common/meta";
import Image from "next/image";
import FooterComponent from "../../components/common/footer";
import { connect } from "react-redux";
import { PricingAction } from "../../store/actions/pricing-action";
import Cookies from "universal-cookie";
import CountryComponent from "../../components/common/country-component";
import { LOGIN_MODAL_OPEN, REGISTER_MODAL_OPEN } from "../../store/type";
import { PaymentsListAction } from "../../store/actions/payments-list-action";

const cookies = new Cookies();
function PricingPage({ dispatch, pricingResponse, profileResponse, paymentListResponse }) {
  const [auth, setAuth] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [year, setYear] = useState("");
  const [duration, setDuration] = useState("");
  const [duration_type, setDurationType] = useState("");
  const [token, setToken] = useState("");
  const [msg,setMsg]=useState("");
  let paymentResponse='';
  useEffect(() => {
    setAuth(cookies.get("token"));
    if(auth!='' && auth !=undefined){ 
        dispatch(PaymentsListAction());
    }
  }, [profileResponse]);
  useEffect(async () => { 
    if(auth!='' && auth !=undefined){
      await dispatch(PaymentsListAction());
    }   
    await dispatch(PricingAction());   
  }, []);
  useEffect(async () => { 
    if(auth!='' && auth !=undefined){
      await dispatch(PaymentsListAction());
    }   
    await dispatch(PricingAction());   
  }, [auth]);
  
  
  useEffect(() => {

  }, [paymentListResponse,paymentResponse]);
  paymentResponse = paymentListResponse.response.data ? paymentListResponse.response.data.map((data)=>{
    return data.subscription_type
  }):''


  
  let pricingList = pricingResponse.response.data 
    ? pricingResponse.response.data.map((data) => (
       // paymentResponse.includes(data.subscription_type) ||  paymentResponse.includes((data.subscription_type+10)) ? 
      //  null :
        <div className="col-md-4" key={data.id}>
          <div id="membership-block">
            {data.subscription_type === "2" ? (
              <img id="bv-icon-img" src="/images/Best Value.svg" />
            ) : null}

            <h2>{data.pricing_data.title}</h2>
            <p>
              {/* <span id="black-text">
                {data.pricing_data[0].currency_symbol}
                {parseFloat(data.pricing_data[0].amount).toFixed(0)}/
              </span>{" "}
              {data.pricing_data[1].currency_symbol}
              {parseFloat(data.pricing_data[1].amount).toFixed(0)} |{" "}
              {data.pricing_data[2].currency_symbol}
              {parseFloat(data.pricing_data[2].amount).toFixed(0)} */}
              {data.pricing_data.details.map((prices)=><span id="black-text">{prices.currency_symbol}{parseFloat(prices.amount).toFixed(0)}/</span>)}
            </p>
            <p id="black-text">
              <b>{data.pricing_data.heading}</b>
            </p>
            <p>{data.pricing_data.content}</p>
            <p>-</p>

            <button
              id="join-now-btn"
              onClick={() => { 
             //   return
                //setYear(data.subscription_type);
                setDuration(data.pricing_data.duration);
                setDurationType(data.pricing_data.duration_type);
                
                setShowModal(true);
              }}
            >
               
              {
                token ? 'RENEW' : 'JOIN NOW'
              }
            </button>
          </div>
        </div>
      ))
    : null;

  return (
    <main>
      <Head>
        <title>Pricing</title>
        <Meta />
      </Head>
      <Header tokenData={(data)=>setToken(data)} />

      <CountryComponent
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        year={duration}
        duration={duration}
        duration_type={duration_type}
      />

      <div className="pricing-page-wrapper">
        <div id="pricing-top-section">
          <div id="pricing-top-bg">
            <div id="membership-div">
              <h1>Pricing for Personal Membership</h1>
              <div className="row" style={{ justifyContent: "center" }}>
                {!auth ? (
                  <div className="col-md-4">
                    <div id="membership-block">
                      <h2>Free</h2>
                      <p>FREE ACCOUNT</p>
                      <p id="black-text">
                        <b>Send our Free Cards</b>
                      </p>
                      <p>Unlimited Sending</p>
                      <p>Free Forever</p>
                      <button  onClick={() => dispatch({ type: REGISTER_MODAL_OPEN })}>Try now</button>
                    </div>
                  </div>
                ) : null}
              
                  
                {pricingList}
              </div>

              <div id="privacy-text">
                <p>
                  For personal use only. We Value Your Privacy &amp; Security.
                </p>
                <p>
                  We will never sell your information and for your protection we
                  never store your credit card information.
                </p>
                <p> Please read our  <Link href="/privacy-policy">privacy policy.</Link> </p>
              </div>
            </div>
          </div>
        </div>

        <div id="money-back-section">
          <h2>Full 30 Day Money Back Guarantee</h2>
          <p>
            We offer a full 30 day money back guarantee
            <br />- so try a paid membership now for unlimited sending of all
            our cards!
          </p>
        </div>

        <div id="ecard-section">
          <div className="row">
            <div className="col-12 col-md-4">
              <div id="design-ecard-block">
                <p id="looking-text">Looking for an ecard for business?</p>
                <h2>Designer Ecards for business.</h2>
                <h3>Make a Lasting Impression. </h3>
                <a href="/browse-all"><button id="browse-all-btn"> BROWSE ALL</button></a>
              </div>
            </div>
            <div className="col-12 col-md-8">
              <img src="images/Media Object.svg" />
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
    </main>
  );
}

export default connect((state) => ({
  pricingResponse: state.pricingResponse,
  profileResponse: state.profileResponse,
  paymentListResponse: state.paymentsListResponse
}))(PricingPage);
