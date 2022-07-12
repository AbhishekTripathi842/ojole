import React, { useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import Header from "../../components/common/header";
import FooterComponent from "../../components/common/footer";
import ProfileMenu from "../../components/common/profile-menu";
import UpdateCreditcardModal from "../../components/common/update-creditcard-modal";
import authenticatedRoute from "../../components/authenticateRoute";
import { connect } from "react-redux";
import { PaymentsListAction } from "../../store/actions/payments-list-action";
import { OrderPaymentItemAction } from "../../store/actions/order-payment-item-action";
import moment from "moment"
import AuthenticatedRoute from "../../components/authenticateRoute";
import OrderPaymentItemsModal from "../../components/common/order-payment-items-model";
import LoadingScreen from "../../components/common/loader";

const BillingPage = ({ dispatch, paymentListResponse, orderPaymentItemResponse }) => {
  const [updateCreditcardModal, setUpdateCreditcardModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [orderPaymentItemsModal, setOrderPaymentItemsModal] = useState(false);
  useEffect(() => {
    setLoading(true)
    dispatch(PaymentsListAction())
  }, [])

  useEffect(() => {
    setLoading(false)
  }, [paymentListResponse, orderPaymentItemResponse])

  const getOrderPaymenyItemData = (id) => {
    setLoading(true)
    dispatch(OrderPaymentItemAction(id))
    setOrderPaymentItemsModal(true)
  }

  let list = paymentListResponse.response.data ? paymentListResponse.response.data.map((data) => (
    <div className="table-div">
      <div className="date-div">
        <label>{moment(data.pay_date).format('MMMM DD,YYYY')}</label>
      </div>
      <div className="amount-div">
        <label>{data.pay_currency === "USD" ? <span>&#36;</span> : data.pay_currency === "GBP" ? <span>&#163;</span> : data.pay_currency === "EUR" ? <span>&#8364;</span> : null}{data.pay_amount}</label>
      </div>
      <div className="description-div">
        <label>{data.time_period + ' ' + data.duration_type}</label>
      </div>
      <div className="action-div" onClick={() => getOrderPaymenyItemData(data.id)}>
        <img
          src="/assets/image/view-icon.svg"
        />
      </div>
    </div>
  )) : null

  return (
    <main>
      <UpdateCreditcardModal
        showModal={updateCreditcardModal}
        handleClose={() => setUpdateCreditcardModal(false)}
      />

      <Head>
        <title>Billing</title>
      </Head>
      {loading ?
        <LoadingScreen></LoadingScreen> : ''
      }
      <Header tokenData={(data) => setToken(data)} />
      <div className="billing-wrapper">
        <div className="billing-container">
          <div className="row m-0">
            <div className="menu-section col-lg-3 p-0">
              <ProfileMenu tab="billing" name="Billing" />
            </div>
            <div className="main-section col-lg-9 p-0">

              {/*
              <div className="payment-method-container">
                <h1>Payment Method</h1>
                <div className="card-information">
                  <img src="assets/image/visa-icon.svg" />
                  <p className="card-username">Timothy Smith</p>
                  <p className="card-number">0000 0000 000000</p>
                  <p className="card-expdate">
                    EXP 1/21 <span className="card-CVC">000</span>
                  </p>
                </div>
                <button onClick={() => setUpdateCreditcardModal(true)}>
                  +update payment method
                </button>
              </div>
              */}

              <div className="order-history-container">
                <h1>Order History</h1>
                <div className="table-container">
                  <div className="table-head-div">
                    <div className="date-div">
                      <label>Order Date</label>
                    </div>
                    <div className="amount-div">
                      <label>Amount</label>
                    </div>
                    <div className="description-div">
                      <label>Description</label>
                    </div>
                    <div className="action-div">
                      <label>Action</label>
                    </div>
                  </div>

                  {list}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
      <OrderPaymentItemsModal
        showModal={orderPaymentItemsModal}
        data={orderPaymentItemResponse && orderPaymentItemResponse.response && orderPaymentItemResponse.response.data}
        handleClose={() => setOrderPaymentItemsModal(false)}
      />
    </main>
  );
};

export default AuthenticatedRoute(connect((state) => ({
  paymentListResponse: state.paymentsListResponse,
  orderPaymentItemResponse: state.orderPaymentItemResponse
}))(BillingPage));
