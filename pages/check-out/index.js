import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "../../components/common/header";
import Meta from "../../components/common/meta";
import Image from "next/image";
import FooterComponent from "../../components/common/footer";
import { connect } from "react-redux";
import { PricingAction } from "../../store/actions/pricing-action";
import { RenewAction } from "../../store/actions/renew-action";
import PaypalExpressBtn from "react-paypal-express-checkout";
import DropIn from "braintree-web-drop-in-react";
import validator from "validator";
import Cookies from "universal-cookie";
import router from "next/router";
import LoadingScreen from "../../components/common/loader";
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Modal } from "react-bootstrap";

// import Base64 from "crypto-js/enc-base64";
import { decode as base64_decode, encode as base64_encode } from "base-64";
import { RegisterAction } from "../../store/actions/register-action";
var CryptoJS = require("crypto-js");
// import JSEncrypt from "jsencrypt";
var aesEcb = require("aes-ecb");
const cookies = new Cookies();
let token = cookies.get("token");
let cvv_regex = /^[0-9]{3,4}$/;
let card_len_regex = /^[0-9]{15,16}$/;

const CARD_ELEMENT_OPTIONS = {
  iconStyle: "solid",
  hidePostalCode: true,
  style: {
      base: {
          color: '#817F80',
          '::placeholder': {
              color: '#817F80',
          },
      },
  },
};


// let cryptoJs = new CryptoJS();
function CheckOutPage({
  dispatch,
  pricingResponse,
  renewResponse,
  profileResponse,
  registerResponse,
}) {

  const stripe = useStripe();
  const elements = useElements();  
  const [loading, setLoading] = React.useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [payerId, setPayerId] = useState("");
  const [stateData, setStateData] = useState({
    subType: "1",
    duration: "",
    duration_type: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    nameOnCard: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    ccv: "",
    currency: "",
    amount: "",
    payment_id: "payment_id",
    payer_id: "payer_id",
    payer_email: "payer_email",
    newsletter_subscribed: 0,
    payMethod: "Paypal",
    encrypt_data: "",
    countryCode: ""
  });
  const [errors, setError] = useState({});
  // const PRIVATE_KEY =
  //   "-----BEGIN RSA PRIVATE KEY----- MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAIJIOsHFX48BHuPDhwxL69KqshSVEsR4pNEG67RPF40YaNzp8AGagmsx2yKtFTt3k1GVjiGYY2oG03AQgBIUcjKGtL0jGgOiPpagiu1a/TPKa+c3Xl5JilngHglVbmdI6/JM9Qd9SMihDhYt/3piyCXAE9mEfK+jaU9vPx+2SpoDAgMBAAECgYBr2r4B0pM0gToAVsuDa4rUQYnhrjP2QOY5QaB6Cgw2O6H8WRLfUPltIr4GbAGq1Gg6XzRmLZEHopUCLjbIQPL0HxfYmWPsOdh06ktcgOBulw0QfaZCtri8k7phiB+6o5j+RN5SZt3LiDSmQRIvQ5WrDHLSFMw+4XU3dy8qZEiH+QJBAMt+/1ZS/XjYfwrbImZkl7AHwz/NUk09q5AzU5dYVpvmYjChw+4cgwvxo5/waYauDz4cq1ahoStAWvE/H+Mj3L0CQQCj5Wunt1iwS9vOx1uUbypUTqLLviJ7tcAJiCKoBX2FDat84FSVJA9PjP1wegz1bRsxS293LJ3ZwFx/0X8F3Z2/AkAGXL0c9NFJ8vLd4wYLT3/SmBuJpiC5m4D+rCwj4jYq/6P4Q0Z97lRGjlKAUKLr/Asr9PeCaOFCGev9+OxFTLy9AkBXR/UV4wEbGbrcGrS9jpnXPe1aXU4V3YuAR/xUyF+4/Lenj/vbVNHGhontXUILbWg+zzJ0H9GMRfG8q/9eS1AXAkBuKN+tNFi6+MzNMpLIM/IQmzDVFuf2g5sGHTYOWQCCLHmvaE4Tg4uei8ucnQFH0708oJTPDwV9FItWWKRDGPcB -----END RSA PRIVATE KEY-----";
  // const PUBLIC_KEY =
  //   "-----BEGIN PUBLIC KEY----- MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCCSDrBxV+PAR7jw4cMS+vSqrIUlRLEeKTRBuu0TxeNGGjc6fABmoJrMdsirRU7d5NRlY4hmGNqBtNwEIASFHIyhrS9IxoDoj6WoIrtWv0zymvnN15eSYpZ4B4JVW5nSOvyTPUHfUjIoQ4WLf96YsglwBPZhHyvo2lPbz8ftkqaAwIDAQAB -----END PUBLIC KEY-----";
  const signatureString = "ojolie paypal is successful";
  const SECRET_KEY = "113223112113213gaega342323t42fda";
  const [tokenCheck, setTokenCheck] = useState("");
  const [stoken, setToken] = useState("");
  const [paypalValidation, setPaypalValidation] = useState(false);
  const [subscriptionModelStatus,setSubscriptionModelStatus] =useState(false)
  const [stripeError,setStripeError]=useState({})
  const client = {
    sandbox:
      "AQRhD5CLN-kwOO5gfBp0kt96OvW_XdyCdfwYUToU4tGQpwMfAKu7cQn0kIcxSbPF2EDQkXkr6Tdag240",
    production: "YOUR-PRODUCTION-APP-ID",
  };

  useEffect(() => {

  }, [paypalValidation, loading]);

  const RSAEncrypted = (data) => {
    if (!paypalValidation) {
      return false
    }
    let Aesencrypted = aesEcb.encrypt(SECRET_KEY, data);
    //console.log("result encrypt " + Aesencrypted);

    return Aesencrypted;
  };
  const onCancel = (data) => {
    // User pressed "cancel" or close Paypal's popup!
    //console.log('The payment was cancelled!', data);

    // You can bind the "data" object's value to your state or props or whatever here, please see below for sample returned data
  }

  const onError = (err) => {
    // The main Paypal's script cannot be loaded or somethings block the loading of that script!
    // console.log("Error!", err);
    // Because the Paypal's main script is loaded asynchronously from "https://www.paypalobjects.com/api/checkout.js"
    // => sometimes it may take about 0.5 second for everything to get set, or for the button to appear
  }

  const onSuccess = (payment) => {
    //console.log("paypay success " + JSON.stringify(payment));
    if (!paypalValidation) {
      return false
    }

    setPaymentId(payment.paymentID);
    setPayerId(payment.paymentToken);
    setStateData({
      ...stateData,
      payer_id: payment.paymentToken,
      payment_id: payment.paymentID,
      payer_email: "payment.email",
      payMethod: "Paypal",
    });
    console.log("stateData " + JSON.stringify(stateData));
    let encData = RSAEncrypted(payment.paymentID);
    let formData = new FormData();
    formData.append("currency", stateData.currency);
    // formData.append("encrypt_data", encData);
    if (stateData.subType === "2") {
      formData.append("amount", stateData.amount);
    } else {
      formData.append("amount", stateData.amount);
    }
    formData.append("card_name", stateData.nameOnCard);
    formData.append("card_expiration_month", stateData.expiryMonth);
    formData.append("card_expiration_year", stateData.expiryYear);
    formData.append("card_ccv", stateData.ccv);
    formData.append("payment_method", stateData.payMethod);
    formData.append("payer_id", payment.paymentToken);
    formData.append("payer_email", stateData.payer_email);
    formData.append("payment_id", payment.paymentID);
    formData.append("encrypted_data", encData);
    formData.append("duration", stateData.duration);
    formData.append("duration_type", stateData.duration_type);
    formData.append("countryCode", stateData.countryCode);
    setLoading(true);
    if (!tokenCheck) {
      formData.append("first_name", stateData.firstName);
      formData.append("last_name", stateData.lastName);
      formData.append("email", stateData.email);
      formData.append("password", stateData.password);
      formData.append("password_confirmation", stateData.password_confirmation);
      formData.append("subscription_type", stateData.subType);
      formData.append("newsletter_subscribed", stateData.newsletter_subscribed);
      dispatch(RegisterAction(formData));
    } else {
      formData.append("subscription_type", stateData.subType === "1" ? 11 : 12);
      dispatch(RenewAction(formData));
    }
  };

  const handleAmountChange = () => { 

    let amount;
    if (parseInt(stateData.subType) === 1) {
      if (stateData.currency === "USD") {
        amount = pricingResponse.response.data[0].pricing_data.details[0].amount;
      } else if (stateData.currency === "EUR") {
        amount = pricingResponse.response.data[0].pricing_data.details[1].amount;
      } else if (stateData.currency === "GBP") {
        amount = pricingResponse.response.data[0].pricing_data.details[2].amount;
      }
    } else if (parseInt(stateData.subType) === 2) {
      if (stateData.currency === "USD") {
        amount = pricingResponse.response.data[1].pricing_data.details[0].amount;
      } else if (stateData.currency === "EUR") {
        amount = pricingResponse.response.data[1].pricing_data.details[1].amount;
      } else if (stateData.currency === "GBP") {
        amount = pricingResponse.response.data[1].pricing_data.details[2].amount;
      }
    }
    return amount;
  };

  const handleChange = (e) => {
    e.preventDefault();
    setStateData({
      ...stateData,
      [e.target.name]: e.target.value,
    });
    setPaypalValidation(false)
    //    paypalValidater()
  };

  useEffect(() => {
    paypalValidater()
  }, [stateData]);

  const paypalValidater = () => {
    //console.log(stateData)
    let current_year = new Date().getFullYear().toString().substr(-2);
    let current_month = new Date().getMonth() + 1;
    let errorStatus = false;
    let errForm = {};
    if (!tokenCheck) {

      if (stateData.firstName == '') {
        //        errForm.first_name='The first name field is required.';       
        errorStatus = true
      }
      if (stateData.lastName == '') {
        //        errForm.last_name='The last name field is required.';     
        errorStatus = true
      }
      if (stateData.email == '') {
        //        errForm.email='The email field is required.';     
        errorStatus = true
      }
      if (!validator.isEmail(stateData.email)) {
        //       errForm.email='Please provide a valid email.';     
        errorStatus = true
      }
      if (stateData.password == '') {
        //      errForm.password='The password field is required.';     
        errorStatus = true
      }
      if (stateData.password_confirmation == '') {
        //      errForm.password_confirmation='The confirm password field is required.';     
        errorStatus = true
      } else if (stateData.password !== stateData.password_confirmation) {
        //      errForm.password_confirmation='The password and confirm password do not match.';     
        errorStatus = true
      }
      if (stateData.cardNumber == '') {
        //      errForm.card_number='The card number field is required.';        
        errorStatus = true
      } else if (!card_len_regex.test(stateData.cardNumber)) {
        //    errForm.card_number='Please provide a valid card number.';      
        errorStatus = true
      }
      if (stateData.nameOnCard == '') {
        //    errForm.card_name='The card name field is required.';        
        errorStatus = true
      }
      if (stateData.expiryMonth == '') {
        //    errForm.card_expiration_month='The card expiration month field is required.';   
        errorStatus = true
      } else if (stateData.expiryMonth < current_month && stateData.expiryYear == current_year) {
        //    errForm.card_expiration_year='The card expiration month field is required.';      
        errorStatus = true
      }
      if (stateData.expiryYear == '') {
        //    errForm.card_expiration_year='The card expiration year field is required.';      
        errorStatus = true
      } else if (stateData.expiryYear < current_year) {
        //    errForm.card_expiration_year='The card expiration year field is required.';      
        errorStatus = true
      }
      if (stateData.ccv == '') {
        //    errForm.card_ccv='The card ccv field is required.';      
        errorStatus = true
      } else if (!cvv_regex.test(stateData.ccv)) {
        //    errForm.card_ccv='Please provide a valid cvv.';      
        errorStatus = true
      }


    } else {
      if (stateData.cardNumber == '') {
        //    errForm.card_number='The card number field is required.';        
        errorStatus = true
      } else if (!card_len_regex.test(stateData.cardNumber)) {
        //    errForm.card_number='Please provide a valid card number.';      
        errorStatus = true
      }
      if (stateData.nameOnCard == '') {
        //    errForm.card_name='The card name field is required.';        
        errorStatus = true
      }
      if (stateData.expiryMonth == '') {
        //    errForm.card_expiration_month='The card expiration month field is required.';   
        errorStatus = true
      } else if (stateData.expiryMonth < current_month && stateData.expiryYear == current_year) {
        //    errForm.card_expiration_year='The card expiration month field is required.';      
        errorStatus = true
      }
      if (stateData.expiryYear == '') {
        //    errForm.card_expiration_year='The card expiration year field is required.';      
        errorStatus = true
      } else if (stateData.expiryYear < current_year) {
        //    errForm.card_expiration_year='The card expiration year field is required.';      
        errorStatus = true
      }
      if (stateData.ccv == '') {
        //    errForm.card_ccv='The card ccv field is required.';      
        errorStatus = true
      } else if (!cvv_regex.test(stateData.ccv)) {
        //    errForm.card_ccv='Please provide a valid cvv.';      
        errorStatus = true
      }
    }

    setPaypalValidation(!errorStatus)
    if (errorStatus) {
      //setError(errForm);
      return false;
    }

    setError({});

  }

  const paypalValidaterBtnHandler = () => {
    //console.log(stateData)
    let current_year = new Date().getFullYear().toString().substr(-2);
    let current_month = new Date().getMonth() + 1;
    let errorStatus = false;
    let errForm = {};
    if (!tokenCheck) {

      if (stateData.firstName == '') {
        errForm.first_name = 'The first name field is required.';
        errorStatus = true
      }
      if (stateData.lastName == '') {
        errForm.last_name = 'The last name field is required.';
        errorStatus = true
      }
      if (stateData.email == '') {
        errForm.email = 'The email field is required.';
        errorStatus = true
      }
      if (!validator.isEmail(stateData.email)) {
        errForm.email = 'Please provide a valid email.';
        errorStatus = true
      }
      if (stateData.password == '') {
        errForm.password = 'Password field is required.';
        errorStatus = true
      }
      if (stateData.password_confirmation == '') {
        errForm.password_confirmation = 'Confirm password field is required.';
        errorStatus = true
      } else if (stateData.password !== stateData.password_confirmation) {
        errForm.password_confirmation = 'Confirm password mismatched';
        errorStatus = true
      }
      if (stateData.cardNumber == '') {
        errForm.card_number = 'The card number field is required.';
        errorStatus = true
      } else if (!card_len_regex.test(stateData.cardNumber)) {
        errForm.card_number = 'Please provide a valid card number.';
        errorStatus = true
      }
      if (stateData.nameOnCard == '') {
        errForm.card_name = 'The card name field is required.';
        errorStatus = true
      }
      if (stateData.expiryMonth == '') {
        errForm.card_expiration_month = 'The card expiration month field is required.';
        errorStatus = true
      } else if (stateData.expiryMonth < current_month && stateData.expiryYear == current_year) {
        errForm.card_expiration_month = 'The card expiration month field is required.';
        errorStatus = true
      }
      if (stateData.expiryYear == '') {
        errForm.card_expiration_year = 'The card expiration year field is required.';
        errorStatus = true
      } else if (stateData.expiryYear < current_year) {
        errForm.card_expiration_year = 'The card expiration year field is required.';
        errorStatus = true
      }
      if (stateData.ccv == '') {
        errForm.card_ccv = 'The card ccv field is required.';
        errorStatus = true
      } else if (!cvv_regex.test(stateData.ccv)) {
        errForm.card_ccv = 'Please provide a valid cvv.';
        errorStatus = true
      }


    } else {
      if (stateData.cardNumber == '') {
        errForm.card_number = 'The card number field is required.';
        errorStatus = true
      } else if (!card_len_regex.test(stateData.cardNumber)) {
        errForm.card_number = 'Please provide a valid card number.';
        errorStatus = true
      }
      if (stateData.nameOnCard == '') {
        errForm.card_name = 'The card name field is required.';
        errorStatus = true
      }
      if (stateData.expiryMonth == '') {
        errForm.card_expiration_month = 'The card expiration month field is required.';
        errorStatus = true
      } else if (stateData.expiryMonth < current_month && stateData.expiryYear == current_year) {
        errForm.card_expiration_month = 'The card expiration month field is required.';
        errorStatus = true
      }
      if (stateData.expiryYear == '') {
        errForm.card_expiration_year = 'The card expiration year field is required.';
        errorStatus = true
      } else if (stateData.expiryYear < current_year) {
        errForm.card_expiration_year = 'The card expiration year field is required.';
        errorStatus = true
      }
      if (stateData.ccv == '') {
        errForm.card_ccv = 'The card ccv field is required.';
        errorStatus = true
      } else if (!cvv_regex.test(stateData.ccv)) {
        errForm.card_ccv = 'Please provide a valid cvv.';
        errorStatus = true
      }
    }

    setPaypalValidation(!errorStatus)
    if (errorStatus) {
      setError(errForm);
      return false;
    }
    setError({});
  }

  useEffect(() => {
    renewResponse.success = false;
    pricingResponse.success = false;
    registerResponse.success = false;
    renewResponse.response.code = "";
    renewResponse.errors = "";
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    setStateData({
      ...stateData,
      subType: 1,
      duration: urlParams.get("duration"),
      duration_type: urlParams.get("duration_type"),
      currency: urlParams.get("currency"),
      countryCode: urlParams.get("countryCode"),
    });
  }, []);

  useEffect(() => {
    let amount = handleAmountChange();

    if (pricingResponse.success) {
      var arrPrice1 = pricingResponse.response.data;
      if(arrPrice1 && arrPrice1.length >0){
        var result1 = arrPrice1.find(resData => { 
          return resData.pricing_data.duration == stateData.duration && resData.pricing_data.duration_type == stateData.duration_type
        })
        var currencyArr = (result1.pricing_data.details).find((currRes) =>{ return currRes.currency ==  stateData.currency})
        amount = currencyArr.amount
      }          

      setStateData({
        ...stateData,
        amount: amount,
      });
    } else {
      dispatch(PricingAction());
    }

    renewResponse.errorMessage = "";
  }, [pricingResponse.response, token]);

  useEffect(() => {
    token = cookies.get("token");
    if (token) {
      setTokenCheck(token);
    } else {
      setTokenCheck("");
    }
  }, [profileResponse]);

  useEffect(() => {
    setLoading(false)
    if (renewResponse.response.code === "000") {
      router.push("/upgrade-message");
    }
  }, [renewResponse]);

  useEffect(() => {
    setLoading(false)
    if (registerResponse.success) {
      router.push("/upgrade-message");
    }
  }, [registerResponse]);

  let pricingList = pricingResponse.response.data
    ? pricingResponse.response.data.map((data) => (
      <div key={data.pricing_data.id}
        className="selection-wrapper"
        onClick={() => { //alert(data.pricing_data.duration)
          //return 
          //let amount = handleAmountChange();

          let amount;
          var arrPrice = pricingResponse.response.data
          if(arrPrice && arrPrice.length >0){
            var result = arrPrice.find(resData => {
              return resData.pricing_data.duration === data.pricing_data.duration && resData.pricing_data.duration_type === data.pricing_data.duration_type
            })
            var currencyArr = (result.pricing_data.details).find((currRes) =>{ return currRes.currency ===  stateData.currency})
            amount = currencyArr.amount
          }
          setStateData({
            ...stateData,
            duration: data.pricing_data.duration,
            duration_type: data.pricing_data.duration_type,
            amount:amount
          });
        }}
      >
        <label htmlFor="selected-item-2" className="selected-label">
          <input
            type="radio"
            name="selected-item"
            id={
              ((stateData.duration == data.pricing_data.duration) && (stateData.duration_type == data.pricing_data.duration_type))
                ? "selected-item-2"
                : ""
            }
            checked={(stateData.duration == data.pricing_data.duration) && (stateData.duration_type == data.pricing_data.duration_type)}
            onChange={() => { }}
          />
          <div className="selected-content">
            <p className="year">{data.pricing_data.title}</p>
            <p className="pricing mb-1">
              {data.pricing_data.details.map((prices) => {
                if (prices.currency !== stateData.currency)
                  return <span>{prices.currency_symbol}{parseFloat(prices.amount).toFixed(0)}{" "}|</span>
                else
                  return prices.currency_symbol + '' + parseFloat(prices.amount).toFixed(0) + ' |'
              }
              )}
            </p>
          </div>
        </label>
      </div>
    ))
    : null;

  useEffect(() => {
  }, [errors])

  const RenewApi = () => { };
  const BraintreeApi = async () => {
    setError({});
    let errorStatus = false;
    let errForm = {};


    let current_year = new Date().getFullYear().toString().substr(-2);
    let current_month = new Date().getMonth() + 1;

    if (!tokenCheck) {

      if (stateData.firstName == '') {
        errForm.first_name = 'The first name field is required.';
        errorStatus = true
      }
      if (stateData.lastName == '') {
        errForm.last_name = 'The last name field is required.';
        errorStatus = true
      }
      if (stateData.email == '') {
        errForm.email = 'The email field is required.';
        errorStatus = true
      }
      if (!validator.isEmail(stateData.email)) {
        errForm.email = 'Please provide a valid email.';
        errorStatus = true
      }
      if (stateData.password == '') {
        errForm.password = 'The password field is required.';
        errorStatus = true
      }
      if (stateData.password_confirmation == '') {
        errForm.password_confirmation = 'The confirm password field is required.';
        errorStatus = true
      } else if (stateData.password !== stateData.password_confirmation) {
        errForm.password_confirmation = 'The password and confirm password do not match.';
        errorStatus = true
      }
      if (stateData.cardNumber == '') {
        errForm.card_number = 'The card number field is required.';
        errorStatus = true
      } else if (!card_len_regex.test(stateData.cardNumber)) {
        errForm.card_number = 'Please provide a valid card number.';
        errorStatus = true
      }
      if (stateData.nameOnCard == '') {
        errForm.card_name = 'The card name field is required.';
        errorStatus = true
      }
      if (stateData.expiryMonth == '') {
        errForm.card_expiration_month = 'The card expiration month field is required.';
        errorStatus = true
      } else if (stateData.expiryMonth < current_month && stateData.expiryYear == current_year) {
        errForm.card_expiration_year = 'The card expiration month field is required.';
        errorStatus = true
      }
      if (stateData.expiryYear == '') {
        errForm.card_expiration_year = 'The card expiration year field is required.';
        errorStatus = true
      } else if (stateData.expiryYear < current_year) {
        errForm.card_expiration_year = 'The card expiration year field is required.';
        errorStatus = true
      }
      if (stateData.ccv == '') {
        errForm.card_ccv = 'The card ccv field is required.';
        errorStatus = true
      } else if (!cvv_regex.test(stateData.ccv)) {
        errForm.card_ccv = 'Please provide a valid cvv.';
        errorStatus = true
      }


    } else {
      if (stateData.cardNumber == '') {
        errForm.card_number = 'The card number field is required.';
        errorStatus = true
      } else if (!card_len_regex.test(stateData.cardNumber)) {
        errForm.card_number = 'Please provide a valid card number.';
        errorStatus = true
      }
      if (stateData.nameOnCard == '') {
        errForm.card_name = 'The card name field is required.';
        errorStatus = true
      }
      if (stateData.expiryMonth == '') {
        errForm.card_expiration_month = 'The card expiration month field is required.';
        errorStatus = true
      } else if (stateData.expiryMonth < current_month && stateData.expiryYear == current_year) {
        errForm.card_expiration_year = 'The card expiration month field is required.';
        errorStatus = true
      }
      if (stateData.expiryYear == '') {
        errForm.card_expiration_year = 'The card expiration year field is required.';
        errorStatus = true
      } else if (stateData.expiryYear < current_year) {
        errForm.card_expiration_year = 'The card expiration year field is required.';
        errorStatus = true
      }
      if (stateData.ccv == '') {
        errForm.card_ccv = 'The card ccv field is required.';
        errorStatus = true
      } else if (!cvv_regex.test(stateData.ccv)) {
        errForm.card_ccv = 'Please provide a valid cvv.';
        errorStatus = true
      }
    }

    if (errorStatus) {
      setError(errForm);
      return false;
    }
    setError({});
    //    setLoading(true);

    if (!tokenCheck) {
      setStateData({
        ...stateData,
        subType: 1,
        // amount: amount,
      });
    } else {
      setStateData({
        ...stateData,
        subType: 2,
        // amount: amount,
      });
    }
    let formData = new FormData();

    formData.append("card_number", stateData.cardNumber);
    formData.append("currency", stateData.currency);
    if (stateData.subType === "2") {
      formData.append("amount", stateData.amount);
    } else {
      formData.append("amount", stateData.amount);
    }

    formData.append("card_name", stateData.nameOnCard);
    formData.append("card_expiration_month", stateData.expiryMonth);
    formData.append("card_expiration_year", stateData.expiryYear);
    formData.append("card_ccv", stateData.ccv);
    formData.append("payment_method", "Braintree");
    formData.append("duration", stateData.duration);
    formData.append("duration_type", stateData.duration_type);
    formData.append("countryCode", stateData.countryCode);
    // formData.append("payer_id", stateData.payer_id);
    // formData.append("payer_email", stateData.payer_email),
    // formData.append("payment_id", stateData.payment_id),
    setLoading(true);
    if (!tokenCheck) {
      formData.append("first_name", stateData.firstName);
      formData.append("last_name", stateData.lastName);
      formData.append("email", stateData.email);
      formData.append("password", stateData.password);
      formData.append("password_confirmation", stateData.password_confirmation);
      formData.append("subscription_type", stateData.subType);
      formData.append("newsletter_subscribed", stateData.newsletter_subscribed);
      dispatch(RegisterAction(formData));
    } else {
      formData.append("subscription_type", stateData.subType);
      dispatch(RenewAction(formData));
    }
    //console.log(stateData, 'formData')
  };

  const stripeApi=async(e)=>{
    e.preventDefault();
    setStripeError({})
    if (!stripe || !elements) {
     // alert('Stripe is not working. Refresh the page.');
    } else {
      const card = elements.getElement(CardElement);
      const result = await stripe.createToken(card);
      
      if (result.error) {
        console.log(result)
        setStripeError(result.error)
        return
      }
      setSubscriptionModelStatus(false)
      setStripeError({})
      let formData = new FormData();

      formData.append("card_token",  result.token.id);
      formData.append("card_number", stateData.cardNumber);
      formData.append("currency", stateData.currency);
      if (stateData.subType === "2") {
        formData.append("amount", stateData.amount);
      } else {
        formData.append("amount", stateData.amount);
      }
  
      formData.append("card_name", stateData.nameOnCard);
      formData.append("card_expiration_month", stateData.expiryMonth);
      formData.append("card_expiration_year", stateData.expiryYear);
      formData.append("card_ccv", stateData.ccv);
      formData.append("payment_method", "stripe");
      formData.append("duration", stateData.duration);
      formData.append("duration_type", stateData.duration_type);
      formData.append("countryCode", stateData.countryCode);
      // formData.append("payer_id", stateData.payer_id);
      // formData.append("payer_email", stateData.payer_email),
      // formData.append("payment_id", stateData.payment_id),
      setLoading(true);
      if (!tokenCheck) {
        formData.append("first_name", stateData.firstName);
        formData.append("last_name", stateData.lastName);
        formData.append("email", stateData.email);
        formData.append("password", stateData.password);
        formData.append("password_confirmation", stateData.password_confirmation);
        formData.append("subscription_type", stateData.subType);
        formData.append("newsletter_subscribed", stateData.newsletter_subscribed);
        dispatch(RegisterAction(formData));
      } else {
        formData.append("subscription_type", stateData.subType);
        dispatch(RenewAction(formData));
      }



    }

  }
  return (
    <main>
      <Head>
        <title>Checkout</title>
        <Meta />
      </Head>
      {loading ?
        <LoadingScreen></LoadingScreen> : ''
      }
      <Header tokenData={(data) => setToken(data)} />

      <div className="check-out-page-wrapper">
        <div className="check-out-page">


          <div className="back-button-container">
            <div className="icon">
              {" "}
              <img src="/assets/image/arrow-back.svg"></img>
            </div>
            <Link href="/pricing">
              <p>Back to Pricing</p>
            </Link>
          </div>

          {tokenCheck === "" ? (
            <div className="checkout-form">
              <h1>Check out</h1>

              <div className="plan-selector">{pricingList}</div>

              <div className="input-wrapper">
                <div className="input-container">
                  <p>First Name <span className="required">*</span></p>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter the first name"
                    onChange={(e) => handleChange(e)}
                    value={stateData.firstName}
                  />
                  {errors && !!errors.first_name ? (
                    <p className="error-style-p">
                      {errors.first_name}
                    </p>
                  ) : null}
                  {registerResponse.errors && !!registerResponse.errors.first_name ? (
                    <p className="error-style-p">
                      {registerResponse.errors.first_name}
                    </p>
                  ) : null}
                </div>
                <div className="input-container">
                  <p>Last Name <span className="required">*</span></p>
                  <input
                    type="text"
                    placeholder="Enter the last name"
                    name="lastName"
                    onChange={(e) => handleChange(e)}
                    value={stateData.lastName}
                  />
                  {errors && !!errors.last_name ? (
                    <p className="error-style-p">
                      {errors.last_name}
                    </p>
                  ) : null}
                  {registerResponse.errors && !!registerResponse.errors.last_name ? (
                    <p className="error-style-p">
                      {registerResponse.errors.last_name}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="input-wrapper">
                <div className="input-container">
                  <p>Email <span className="required">*</span></p>
                  <input
                    type="email"
                    placeholder="example@email.com"
                    name="email"
                    onChange={(e) => handleChange(e)}
                    value={stateData.email}
                  />
                  {errors && !!errors.email ? (
                    <p className="error-style-p">
                      {errors.email}
                    </p>
                  ) : null}
                  {registerResponse.errors && !!registerResponse.errors.email ? (
                    <p className="error-style-p">
                      {registerResponse.errors.email}
                    </p>
                  ) : null}
                </div>
                <div className="input-container">
                  <p>Phone</p>
                  <input
                    type="text"
                    placeholder="Enter the phone"
                    name="phone"
                    onChange={(e) => handleChange(e)}
                    value={stateData.phone}
                  />
                  {errors && !!errors.phone ? (
                    <p className="error-style-p">
                      {errors.phone}
                    </p>
                  ) : null}
                  {registerResponse.errors && !!registerResponse.errors.phone ? (
                    <p className="error-style-p">
                      {registerResponse.errors.phone}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="input-wrapper">
                <div className="input-container">
                  <p>Password <span className="required">*</span></p>
                  <input
                    type="password"
                    placeholder="Enter the password"
                    name="password"
                    onChange={(e) => handleChange(e)}
                    value={stateData.password}
                  />
                  {errors && !!errors.password ? (
                    <p className="error-style-p">
                      {errors.password}
                    </p>
                  ) : null}
                  {registerResponse.errors && !!registerResponse.errors.password ? (
                    <p className="error-style-p">
                      {registerResponse.errors.password}
                    </p>
                  ) : null}
                </div>
                <div
                  className="input-container mb-0"

                >
                  <p>Confirm Password <span className="required">*</span></p>
                  <input
                    type="password"
                    placeholder="Renter the password"
                    name="password_confirmation"
                    onChange={(e) => handleChange(e)}
                    value={stateData.password_confirmation}
                  />
                  {errors && !!errors.password_confirmation ? (
                    <p className="error-style-p">
                      {errors.password_confirmation}
                    </p>
                  ) : null}
                </div>


              </div>
              <div className="input-wrapper">
                <div className="input-container">
                  <p>Name on Card <span className="required">*</span></p>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      placeholder="Enter the name on card"
                      name="nameOnCard"
                      onChange={(e) => handleChange(e)}
                      value={stateData.nameOnCard}
                    />
                    <img src="/assets/image/name-icon.svg" />
                  </div>
                  {errors && !!errors.card_name ? (
                    <p className="error-style-p">
                      {errors.card_name}
                    </p>
                  ) : null}
                  {renewResponse.errors && !!renewResponse.errors.card_name ? (
                    <p className="error-style-p">
                      {renewResponse.errors.card_name}
                    </p>
                  ) : null}
                  {registerResponse.errors && !!registerResponse.errors.card_name ? (
                    <p className="error-style-p">
                      {registerResponse.errors.card_name}
                    </p>
                  ) : null}
                </div>
                <div className="input-container">
                  <p>Card Number <span className="required">*</span></p>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      placeholder="4032033065040557"
                      name="cardNumber"
                      onChange={(e) => handleChange(e)}
                      value={stateData.cardNumber}
                    />
                    <img src="/assets/image/card-icon.svg" />
                  </div>
                  {errors && !!errors.card_number ? (
                    <p className="error-style-p">
                      {errors.card_number}
                    </p>
                  ) : null}
                  {registerResponse.errors && !!renewResponse.errors.card_number ? (
                    <p className="error-style-p">
                      {renewResponse.errors.card_number}
                    </p>
                  ) : null}
                  {registerResponse.errors && !!registerResponse.errors.card_number ? (
                    <p className="error-style-p">
                      {registerResponse.errors.card_number}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="input-wrapper">

                <div className="input-container">
                  <p>Expiration Date <span className="required">*</span></p>
                  <div className="input-with-icon">
                    <div className="expiry-date-div">
                      <input
                        type="text"
                        placeholder="MM"
                        name="expiryMonth"
                        onChange={(e) => handleChange(e)}
                        value={stateData.expiryDate}
                        maxLength={2}
                      />
                      <span>/</span>
                      <input
                        type="text"
                        placeholder="YY"
                        name="expiryYear"
                        onChange={(e) => handleChange(e)}
                        value={stateData.expiryDate}
                        maxLength={2}
                      />
                    </div>
                    <img src="/assets/image/date-icon.svg" />
                  </div>

                  {errors && !!errors.card_expiration_month ||
                    errors && !!errors.card_expiration_year ? (
                      <p className="error-style-p">Invalid Expire Date</p>
                    ) : null}
                  {registerResponse.errors && !!registerResponse.errors.card_expiration_month || registerResponse.errors && !!registerResponse.errors.card_expiration_year ? (
                    <p className="error-style-p">
                      {registerResponse.errors.card_expiration_year}
                    </p>
                  ) : null}
                  {renewResponse.errors && !!renewResponse.errors.card_expiration_month ||
                    renewResponse.errors && !!renewResponse.errors.card_expiration_year ? (
                      <p className="error-style-p">Invalid Expire Date</p>
                    ) : null}
                  {registerResponse.errors && !!registerResponse.errors.card_expiration_month || registerResponse.errors && !!registerResponse.errors.card_expiration_year ? (
                    <p className="error-style-p">
                      {registerResponse.errors.card_expiration_year}
                    </p>
                  ) : null}
                </div>
                <div className="input-container mb-0">
                  <p>CCV - Security Code<span className="required">*</span></p>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      placeholder="eg.123"
                      name="ccv"
                      onChange={(e) => handleChange(e)}
                      value={stateData.ccv}
                      maxLength={3}
                    />
                    <img src="/assets/image/lock-icon.svg" />
                  </div>
                  {errors && !!errors.card_ccv ? (
                    <p className="error-style-p">
                      {errors.card_ccv}
                    </p>
                  ) : null}
                  {renewResponse.errors && !!renewResponse.errors.card_ccv ? (
                    <p className="error-style-p">
                      {renewResponse.errors.card_ccv}
                    </p>
                  ) : null}
                  {registerResponse.errors && !!registerResponse.errors.card_ccv ? (
                    <p className="error-style-p">
                      {registerResponse.errors.card_ccv}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="input-wrapper">

                <div className="payment-container">
                  <img src="/assets/image/mastercard-icon.svg" />
                  <img src="/assets/image/visa-icon.svg" />
                  <img src="/assets/image/paypal-icon.svg" />
                </div>
              </div>

              <div className="input-container">
                <label>
                  <input type="checkbox"></input>
                  <span></span>
                  <p className="mb-0">
                    Be the first to hear about special offers and news.
                    Unsubscribe anytime.
                  </p>
                </label>
              </div>

              <div className="button-container">
                {/* <Link href="/upgrade-message"> */}
                {/* <button className="paypal-button">
                  <img src="/assets/image/logo-paypal.svg" />
                  <p>Checkout VIA Paypal</p>
                </button> */}
                <div style={{ width: "63%", margin: "auto" }}>

                  {registerResponse && registerResponse.errorMessage ? (
                    <p className="error-style-p">
                      {registerResponse.errorMessage}
                    </p>
                  ) : null}

                  {renewResponse && renewResponse.errorMessage ? (
                    <p className="error-style-p">
                      {renewResponse.errorMessage}
                    </p>
                  ) : null}
                  {typeof window !== "undefined" && paypalValidation ? (
                    <PaypalExpressBtn
                      client={client}
                      currency={stateData.currency}
                      total={stateData.amount ? stateData.amount : 0}
                      onSuccess={onSuccess}
                      onCancel={onCancel}
                      onError={onError}
                      style={{
                        color: "gold",
                        shape: "rect",
                        label: "checkout",
                        size: "responsive",

                      }}
                    />
                  ) : <button style={{ backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundImage: `url("images/paypal-bg.png")`, backgroundSize: '200px 70px' }} className="checkout-button" onClick={() => { paypalValidaterBtnHandler() }}></button>}
                </div>
                {/* </Link> */}
                {/* <Link href="/upgrade-message"> */}
                <button
                  className="checkout-button"
                  onClick={() => BraintreeApi()}
                >
                  Checkout
                </button>
                {/* </Link> */}
                {/* <DropIn
                options={{
                  authorization:
                    "eyJ2ZXJzaW9uIjoyLCJhdXRob3JpemF0aW9uRmluZ2VycHJpbnQiOiI5YTk5OGE1OWUxOWIwMjI5OGViMTlhYWRhMTBmYzQ0ZjM4YmM3ZDkxYWI2NzczZTY2MDg1YTNmOGE5MTE5MjBlfGNyZWF0ZWRfYXQ9MjAxNy0wNS0xNlQxMDoyMDoyMi4wMTU5NTc5NTMrMDAwMFx1MDAyNm1lcmNoYW50X2FjY291bnRfaWQ9NmNzaGhzNXp4dzV0cnB2c1x1MDAyNm1lcmNoYW50X2lkPWN6dGdjcnBiNXN4eGI3ajhcdTAwMjZwdWJsaWNfa2V5PWZ3bWZmOWpzOHR4cnhyNHAiLCJjb25maWdVcmwiOiJodHRwczovL2FwaS5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tOjQ0My9tZXJjaGFudHMvY3p0Z2NycGI1c3h4YjdqOC9jbGllbnRfYXBpL3YxL2NvbmZpZ3VyYXRpb24iLCJjaGFsbGVuZ2VzIjpbImN2diJdLCJlbnZpcm9ubWVudCI6InNhbmRib3giLCJjbGllbnRBcGlVcmwiOiJodHRwczovL2FwaS5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tOjQ0My9tZXJjaGFudHMvY3p0Z2NycGI1c3h4YjdqOC9jbGllbnRfYXBpIiwiYXNzZXRzVXJsIjoiaHR0cHM6Ly9hc3NldHMuYnJhaW50cmVlZ2F0ZXdheS5jb20iLCJhdXRoVXJsIjoiaHR0cHM6Ly9hdXRoLnZlbm1vLnNhbmRib3guYnJhaW50cmVlZ2F0ZXdheS5jb20iLCJhbmFseXRpY3MiOnsidXJsIjoiaHR0cHM6Ly9jbGllbnQtYW5hbHl0aWNzLnNhbmRib3guYnJhaW50cmVlZ2F0ZXdheS5jb20vY3p0Z2NycGI1c3h4YjdqOCJ9LCJ0aHJlZURTZWN1cmVFbmFibGVkIjpmYWxzZSwicGF5cGFsRW5hYmxlZCI6dHJ1ZSwicGF5cGFsIjp7ImRpc3BsYXlOYW1lIjoiVGFwcG9pbnRtZW50IiwiY2xpZW50SWQiOm51bGwsInByaXZhY3lVcmwiOiJodHRwOi8vZXhhbXBsZS5jb20vcHAiLCJ1c2VyQWdyZWVtZW50VXJsIjoiaHR0cDovL2V4YW1wbGUuY29tL3RvcyIsImJhc2VVcmwiOiJodHRwczovL2Fzc2V0cy5icmFpbnRyZWVnYXRld2F5LmNvbSIsImFzc2V0c1VybCI6Imh0dHBzOi8vY2hlY2tvdXQucGF5cGFsLmNvbSIsImRpcmVjdEJhc2VVcmwiOm51bGwsImFsbG93SHR0cCI6dHJ1ZSwiZW52aXJvbm1lbnROb05ldHdvcmsiOnRydWUsImVudmlyb25tZW50Ijoib2ZmbGluZSIsInVudmV0dGVkTWVyY2hhbnQiOmZhbHNlLCJicmFpbnRyZWVDbGllbnRJZCI6Im1hc3RlcmNsaWVudDMiLCJiaWxsaW5nQWdyZWVtZW50c0VuYWJsZWQiOnRydWUsIm1lcmNoYW50QWNjb3VudElkIjoiNmNzaGhzNXp4dzV0cnB2cyIsImN1cnJlbmN5SXNvQ29kZSI6IlVTRCJ9LCJjb2luYmFzZUVuYWJsZWQiOmZhbHNlLCJtZXJjaGFudElkIjoiY3p0Z2NycGI1c3h4YjdqOCIsInZlbm1vIjoib2ZmIiwiYXBwbGVQYXkiOnsic3RhdHVzIjoibW9jayIsImNvdW50cnlDb2RlIjoiVVMiLCJjdXJyZW5jeUNvZGUiOiJVU0QiLCJtZXJjaGFudElkZW50aWZpZXIiOiJtZXJjaGFudC5jb20udGFwcG9pbnRtZW50Iiwic3VwcG9ydGVkTmV0d29ya3MiOlsidmlzYSIsIm1hc3RlcmNhcmQiLCJhbWV4IiwiZGlzY292ZXIiXX0sIm1lcmNoYW50QWNjb3VudElkIjoiNmNzaGhzNXp4dzV0cnB2cyJ9",
                }}
                // onInstance={(instance) => (this.instance = instance)}
              /> */}


              {typeof window !== "undefined" && paypalValidation ? (
                  <React.Fragment>
                  <button style={{ backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: '200px 70px' }} className="checkout-button" onClick={() => { setSubscriptionModelStatus(true) }}>Checkout Via Stripe</button>
                    <Modal show={subscriptionModelStatus} id="SubscriptionPopUp"  className="modal-md-lg" centered>
                      <Modal.Header><h5>Stripe</h5></Modal.Header>
                      <Modal.Body>
                        <form onSubmit={stripeApi}  options={CARD_ELEMENT_OPTIONS}>
                              <CardElement />
                              <br/>
                              <div className="float-right" style={{float:'right'}}>
                              <button type="submit" disabled={!stripe || !elements} className="btn btn-primary " >
                                Payment
                              </button>
                              &nbsp;
                              <button type="button" className="btn btn-danger" onClick={()=>{setSubscriptionModelStatus(false);setStripeError({})}}>Cancel</button>
                              </div>
                        </form>
                        {stripeError  && stripeError.message ? <p className="error-style-p">{stripeError.message}</p> : ''}
                      </Modal.Body>
                    </Modal>
                    </React.Fragment>
                  ) : <button style={{ backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: '200px 70px' }} className="checkout-button" onClick={() => { paypalValidaterBtnHandler() }}>Checkout Via Stripe</button>}

              </div>

              <p className="terms-text">
                By creating an account, I agree with
                <span className="terms-textbold">
                  {" "}
                  Ojolie's Terms of Service{" "}
                </span>
                and <span className="terms-textbold"> Privacy Policy.</span>
              </p>
              <p className="login-button mb-5">
                Already have an account? <a href="#">Login.</a>
              </p>
            </div>
          ) : (
              <div className="checkout-form">
                <h1>Check out</h1>

                <div className="plan-selector">{pricingList}</div>

                <div className="input-wrapper">
                  <div className="input-container">
                    <p>Name on Card<span className="required">*</span></p>
                    <div className="input-with-icon">
                      <input
                        type="text"
                        placeholder="Write here..."
                        name="nameOnCard"
                        onChange={(e) => handleChange(e)}
                        value={stateData.nameOnCard}
                      />
                      <img src="/assets/image/name-icon.svg" />
                    </div>
                    {errors && !!errors.card_name ? (
                      <p className="error-style-p">
                        {errors.card_name}
                      </p>
                    ) : null}
                    {renewResponse.errors && !!renewResponse.errors.card_number ? (
                      <p className="error-style-p">
                        {renewResponse.errors.card_number}
                      </p>
                    ) : null}
                  </div>
                  <div className="input-container">
                    <p>Expiration Date<span className="required">*</span></p>
                    <div className="input-with-icon">
                      <div className="expiry-date-div">
                        <input
                          type="text"
                          placeholder="MM"
                          name="expiryMonth"
                          onChange={(e) => handleChange(e)}
                          value={stateData.expiryDate}
                          maxLength={2}
                        />
                        <span>/</span>
                        <input
                          type="text"
                          placeholder="YY"
                          name="expiryYear"
                          onChange={(e) => handleChange(e)}
                          value={stateData.expiryDate}
                          maxLength={2}
                        />
                      </div>

                      <img src="/assets/image/date-icon.svg" />
                    </div>
                    {errors && !!errors.card_expiration_month ||
                      errors && !!errors.card_expiration_year ? (
                        <p className="error-style-p">Invalid Expire Date</p>
                      ) : null}
                    {renewResponse.errors && !!renewResponse.errors.card_expiration_month ||
                      renewResponse.errors && !!renewResponse.errors.card_expiration_year ? (
                        <p className="error-style-p">Invalid Expire Date</p>
                      ) : null}
                  </div>
                </div>

                <div className="input-wrapper">
                  <div className="input-container">
                    <p>Card Number<span className="required">*</span></p>
                    <div className="input-with-icon">
                      <input
                        type="text"
                        placeholder="4032033065040557"
                        name="cardNumber"
                        onChange={(e) => handleChange(e)}
                        value={stateData.cardNumber}
                      />
                      <img src="/assets/image/card-icon.svg" />
                    </div>
                    {errors && !!errors.card_number ? (
                      <p className="error-style-p">
                        {errors.card_number}
                      </p>
                    ) : null}
                    {renewResponse.errors && !!renewResponse.errors.card_number ? (
                      <p className="error-style-p">
                        {renewResponse.errors.card_number}
                      </p>
                    ) : null}
                  </div>
                  <div className="input-container mb-0">
                    <p>CCV - Security Code<span className="required">*</span></p>
                    <div className="input-with-icon">
                      <input
                        type="text"
                        placeholder="eg.123"
                        name="ccv"
                        onChange={(e) => handleChange(e)}
                        value={stateData.ccv}
                        maxLength={3}
                      />
                      <img src="/assets/image/lock-icon.svg" />
                    </div>
                    {errors && !!errors.card_ccv ? (
                      <p className="error-style-p">
                        {errors.card_ccv}
                      </p>
                    ) : null}
                    {renewResponse.errors && !!renewResponse.errors.card_ccv ? (
                      <p className="error-style-p">
                        {renewResponse.errors.card_ccv}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="input-wrapper">
                  <div
                    className="input-container mb-0"
                    style={{ marginTop: "35px" }}
                  ></div>
                  <div className="payment-container">
                    <img src="/assets/image/mastercard-icon.svg" />
                    <img src="/assets/image/visa-icon.svg" />
                    <img src="/assets/image/paypal-icon.svg" />
                  </div>
                </div>

                <div className="input-container">
                  <label>
                    <input type="checkbox"></input>
                    <span></span>
                    <p className="mb-0">
                      Be the first to hear about special offers and news.
                      Unsubscribe anytime.
                  </p>
                  </label>
                </div>

                <div className="button-container">
                  {/* <Link href="/upgrade-message"> */}
                  {/* <button className="paypal-button">
              <img src="/assets/image/logo-paypal.svg" />
              <p>Checkout VIA Paypal</p>
            </button> */}
                  <div
                    style={{ width: "63%", margin: "auto" }}
                    onClick={onSuccess}
                  >
                    {renewResponse && renewResponse.errorMessage ? (
                      <p className="error-style-p">
                        {renewResponse.errorMessage}
                      </p>
                    ) : null}
                    {typeof window !== "undefined" && paypalValidation ? (
                      <PaypalExpressBtn
                        client={client}
                        currency={stateData.currency}
                        total={stateData.amount}
                        onSuccess={onSuccess}
                        onCancel={onCancel}
                        onError={onError}
                        style={{
                          color: "gold",
                          shape: "rect",
                          label: "checkout",
                          size: "responsive",
                          //  width: "63%"
                        }}
                      />
                    ) : <button style={{
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      backgroundImage: `url("images/paypal-bg.png")`, backgroundSize: '200px 70px'
                    }}
                      className="checkout-button" onClick={() => { paypalValidaterBtnHandler() }}></button>}
                  </div>
                  {/* </Link> */}
                  {/* <Link href="/upgrade-message"> */}
                  <button
                    className="checkout-button"
                    onClick={() => BraintreeApi()}
                  >
                    Checkout
                </button>
                  {/* </Link> */}
                  {/* <DropIn
            options={{
              authorization:
                "eyJ2ZXJzaW9uIjoyLCJhdXRob3JpemF0aW9uRmluZ2VycHJpbnQiOiI5YTk5OGE1OWUxOWIwMjI5OGViMTlhYWRhMTBmYzQ0ZjM4YmM3ZDkxYWI2NzczZTY2MDg1YTNmOGE5MTE5MjBlfGNyZWF0ZWRfYXQ9MjAxNy0wNS0xNlQxMDoyMDoyMi4wMTU5NTc5NTMrMDAwMFx1MDAyNm1lcmNoYW50X2FjY291bnRfaWQ9NmNzaGhzNXp4dzV0cnB2c1x1MDAyNm1lcmNoYW50X2lkPWN6dGdjcnBiNXN4eGI3ajhcdTAwMjZwdWJsaWNfa2V5PWZ3bWZmOWpzOHR4cnhyNHAiLCJjb25maWdVcmwiOiJodHRwczovL2FwaS5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tOjQ0My9tZXJjaGFudHMvY3p0Z2NycGI1c3h4YjdqOC9jbGllbnRfYXBpL3YxL2NvbmZpZ3VyYXRpb24iLCJjaGFsbGVuZ2VzIjpbImN2diJdLCJlbnZpcm9ubWVudCI6InNhbmRib3giLCJjbGllbnRBcGlVcmwiOiJodHRwczovL2FwaS5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tOjQ0My9tZXJjaGFudHMvY3p0Z2NycGI1c3h4YjdqOC9jbGllbnRfYXBpIiwiYXNzZXRzVXJsIjoiaHR0cHM6Ly9hc3NldHMuYnJhaW50cmVlZ2F0ZXdheS5jb20iLCJhdXRoVXJsIjoiaHR0cHM6Ly9hdXRoLnZlbm1vLnNhbmRib3guYnJhaW50cmVlZ2F0ZXdheS5jb20iLCJhbmFseXRpY3MiOnsidXJsIjoiaHR0cHM6Ly9jbGllbnQtYW5hbHl0aWNzLnNhbmRib3guYnJhaW50cmVlZ2F0ZXdheS5jb20vY3p0Z2NycGI1c3h4YjdqOCJ9LCJ0aHJlZURTZWN1cmVFbmFibGVkIjpmYWxzZSwicGF5cGFsRW5hYmxlZCI6dHJ1ZSwicGF5cGFsIjp7ImRpc3BsYXlOYW1lIjoiVGFwcG9pbnRtZW50IiwiY2xpZW50SWQiOm51bGwsInByaXZhY3lVcmwiOiJodHRwOi8vZXhhbXBsZS5jb20vcHAiLCJ1c2VyQWdyZWVtZW50VXJsIjoiaHR0cDovL2V4YW1wbGUuY29tL3RvcyIsImJhc2VVcmwiOiJodHRwczovL2Fzc2V0cy5icmFpbnRyZWVnYXRld2F5LmNvbSIsImFzc2V0c1VybCI6Imh0dHBzOi8vY2hlY2tvdXQucGF5cGFsLmNvbSIsImRpcmVjdEJhc2VVcmwiOm51bGwsImFsbG93SHR0cCI6dHJ1ZSwiZW52aXJvbm1lbnROb05ldHdvcmsiOnRydWUsImVudmlyb25tZW50Ijoib2ZmbGluZSIsInVudmV0dGVkTWVyY2hhbnQiOmZhbHNlLCJicmFpbnRyZWVDbGllbnRJZCI6Im1hc3RlcmNsaWVudDMiLCJiaWxsaW5nQWdyZWVtZW50c0VuYWJsZWQiOnRydWUsIm1lcmNoYW50QWNjb3VudElkIjoiNmNzaGhzNXp4dzV0cnB2cyIsImN1cnJlbmN5SXNvQ29kZSI6IlVTRCJ9LCJjb2luYmFzZUVuYWJsZWQiOmZhbHNlLCJtZXJjaGFudElkIjoiY3p0Z2NycGI1c3h4YjdqOCIsInZlbm1vIjoib2ZmIiwiYXBwbGVQYXkiOnsic3RhdHVzIjoibW9jayIsImNvdW50cnlDb2RlIjoiVVMiLCJjdXJyZW5jeUNvZGUiOiJVU0QiLCJtZXJjaGFudElkZW50aWZpZXIiOiJtZXJjaGFudC5jb20udGFwcG9pbnRtZW50Iiwic3VwcG9ydGVkTmV0d29ya3MiOlsidmlzYSIsIm1hc3RlcmNhcmQiLCJhbWV4IiwiZGlzY292ZXIiXX0sIm1lcmNoYW50QWNjb3VudElkIjoiNmNzaGhzNXp4dzV0cnB2cyJ9",
            }}
            // onInstance={(instance) => (this.instance = instance)}
          /> */}
                {typeof window !== "undefined" && paypalValidation ? (
                  <React.Fragment>
                  <button style={{ backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: '200px 70px' }} className="checkout-button" onClick={() => { setSubscriptionModelStatus(true) }}>Checkout Via Stripe</button>
                    <Modal show={subscriptionModelStatus} id="SubscriptionPopUp"  className="modal-md-lg" centered>
                      <Modal.Header><h5>Stripe</h5></Modal.Header>
                      <Modal.Body>
                        <form onSubmit={stripeApi}  options={CARD_ELEMENT_OPTIONS}>
                              <CardElement />
                              <br/>
                              <div className="float-right" style={{float:'right'}}>
                              <button type="submit" disabled={!stripe || !elements} className="btn btn-primary " >
                                Payment
                              </button>
                              &nbsp;
                              <button type="button" className="btn btn-danger" onClick={()=>{setSubscriptionModelStatus(false);setStripeError({})}}>Cancel</button>
                              </div>
                        </form>
                        {stripeError  && stripeError.message ? <p className="error-style-p">{stripeError.message}</p> : ''}
                      </Modal.Body>
                    </Modal>
                    </React.Fragment>
                  ) : <button style={{ backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: '200px 70px' }} className="checkout-button" onClick={() => { paypalValidaterBtnHandler() }}>Checkout Via Stripe</button>}
           
                </div>

                <p className="terms-text">
                  By creating an account, I agree with
                <span className="terms-textbold">
                    {" "}
                    Ojolie's Terms of Service{" "}
                  </span>
                  and <span className="terms-textbold"> Privacy Policy.</span>
                </p>
                {/* <p className="login-button mb-5">
                Already have an account? <a href="#">Login.</a>
              </p> */}
              </div>
            )}
        </div>
      </div>
      <FooterComponent />
    </main>
  );
}

export default connect((state) => ({
  pricingResponse: state.pricingResponse,
  renewResponse: state.renewResponse,
  profileResponse: state.profileResponse,
  registerResponse: state.registerResponse,
}))(CheckOutPage);
