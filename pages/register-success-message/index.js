import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "../../components/common/header";
import Meta from "../../components/common/meta";
import Image from "next/image";
import FooterComponent from "../../components/common/footer";
import CountryComponent from "../../components/common/country-component";
import { connect } from "react-redux";
import { PricingAction } from "../../store/actions/pricing-action";
import { PaymentsListAction } from "../../store/actions/payments-list-action";
import Cookies from "universal-cookie";
const cookies = new Cookies();
function RegisterSuccessMessagePage({ dispatch, pricingResponse, profileResponse, paymentListResponse }) {
  //const [token, setToken] = useState("");
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
          <title>Success</title>
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
        <div className="register-success-page-wrapper">
            <div className="register-success-section">
            
                <h1>Thank you for <br /> Registering!</h1>
                <p>A confirmation email has been sent to you. <br />
                You can now use all our <Link href="/cards/free">free cards.</Link> <br />
                To send our premium cards, you will need to upgrade to a paid membership. <br />
                Any cards you write will be sent once you have confirmed your email address.</p>
            

            </div>
            <div className="plan-offer-wrapper">
              
                <img src="/assets/image/flowers.svg" />
                <div className="plan-offer-section">
                  
                    <div className="offer-text">
                      <p className="small-text">Send with confidence connect deeply</p>
                      <h1>Designer Ecards</h1>
                      <p>Your Friends and family will thank you for it. 30 day money back guarantee. <br/>
                      Unlimited sending all year for one low price.</p>
                    </div>
                    {pricingList}
                    {/* <div id="membership-block">
                      
                      <h2>1 YEAR</h2>
                      <p>
                        <span id="black-text">$14 /</span> €17 | £14
                      </p>
                      <p id="black-text">
                        <b>Send our Free Cards</b>
                      </p>
                      <p>Unlimited Sending</p>
                      <p>-</p>
                      <Link href="/check-out">
                      <button id="join-now-btn">JOIN NOW</button>
                      </Link>
                    </div>
                    
                    <div id="membership-block">
                      <img id="bv-icon-img" src="/images/Best Value.svg" />
                      <h2>2 YEARS</h2>
                      <p>
                        <span id="black-text">$21 /</span> €25 | £21
                      </p>
                      <p id="black-text">
                        <b>Send our Free Cards</b>
                      </p>
                      <p>Unlimited Sending</p>
                      <p>-</p>
                      <Link href="/check-out">
                      <button id="join-now-btn">JOIN NOW</button>
                      </Link>
                    </div> */}
                    
                </div>
                <p className="privacy-small-text">
                  For personal use only. We Value Your Privacy & Security. <br />
                  We will never sell your information and for your protection we never store your credit card information. <br />
                  Please read our <span>privacy policy</span>.
                </p>
            </div>
            <div className="guarantee-section">

                <h1>Full 30 Day Money Back Guarantee</h1>
                <p>We offer a full 30 day money back guarantee <br/>
                - so try a paid membership now for unlimited sending of all our cards! </p>

            </div>
        </div>
        <FooterComponent />
      </main>
    );
  }
  
  //export default RegisterSuccessMessagePage;
  export default connect((state) => ({
    pricingResponse: state.pricingResponse,
    profileResponse: state.profileResponse,
    paymentListResponse: state.paymentsListResponse
  }))(RegisterSuccessMessagePage);
  