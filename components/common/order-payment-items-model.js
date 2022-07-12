import { Modal } from "react-bootstrap";
import moment from "moment"



function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
const OrderPaymentItemsModal = ({ showModal, handleClose, data }) => {

    const paymentData = data && data[0] && data[0].payments
    const orderItemData = data && data[0] && data[0].order_items
    let itemsList = orderItemData ? orderItemData.map((data) => (
        <tr>
           {/*  <td>
                <label>{data.id}</label>
            </td>
            <td>
                <label>{data.order_id}</label>
            </td> */}
            <td>
                <label>{capitalizeFirstLetter(data.order_type)}</label>
            </td>
           {/*  <td>
                <label>{data.subscription_id}</label>
            </td> */}
            <td>
                <label>{paymentData.pay_currency === "USD" ? <span>&#36;</span> : paymentData.pay_currency === "GBP" ? <span>&#163;</span> : paymentData.pay_currency === "EUR" ? <span>&#8364;</span> : null}{data.amount}</label>
            </td>
            {/* <td>
                <label>{data.discount}</label>
            </td> */}
           {/*  <td>
                <label>{data.total_amount}</label>
            </td> */}
            <td>
                <label>{moment(data.created_at).format('MMMM DD,YYYY')}</label>
            </td>
        </tr>
    )) : null

    return (
        <Modal show={showModal} onHide={handleClose} size="lg" className="card-shared-modal">
            <Modal.Header closeButton>
                <Modal.Title>Order Details.</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <h5 className="text-center mb-4">Payment Data</h5>
                    <div className="container">
                        <div className="row order-payments">
                            <div className="col-sm mb-3">
                                <label><b>Payer</b></label>
                                <div className="label-value">{paymentData && paymentData.pay_name}</div>
                            </div>
                            <div className="col-sm mb-3">
                                <label><b>Method</b></label>
                                <div className="label-value">{paymentData && paymentData.pay_via_type}</div>
                            </div>
                            <div className="col-sm mb-3">
                                <label><b>Plateform</b></label>
                                <div className="label-value">{paymentData && paymentData.payment_plateform}</div>
                            </div>
                        </div>
                        <div className="row order-payments">
                            <div className="col-sm mb-3">
                                <label><b>Currency</b></label>
                                <div className="label-value">{paymentData && paymentData.pay_currency ? paymentData.pay_currency === "USD" ? <span>&#36;</span> : paymentData.pay_currency === "GBP" ? <span>&#163;</span> : paymentData.pay_currency === "EUR" ? <span>&#8364;</span> : null : ''}</div>
                            </div>
                            <div className="col-sm mb-3">
                                <label><b>Amount</b></label>
                                <div className="label-value">{paymentData && paymentData.pay_amount}</div>
                            </div>
                            <div className="col-sm mb-3">
                                <label><b>Date</b></label>
                                <div className="label-value">{paymentData && moment(paymentData.pay_date).format('MMMM DD,YYYY')}</div>
                            </div>

                        </div>
                        <div className="row order-payments">

                            <div className="col-sm mb-3">
                                <label><b>Transaction Number</b></label>
                                <div className="label-value">{paymentData && paymentData.transaction_number}</div>
                            </div>
                            <div className="col-sm mb-3">
                                <label><b>Pay Via</b></label>
                                <div className="label-value">{paymentData && paymentData.pay_via}</div>
                            </div>
                            <div className="col-sm mb-3">
                                <label><b>Email</b></label>
                                <div className="label-value">{paymentData && paymentData.pay_email}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h5 className="text-center mb-4 mt-4">Order Items</h5>
                    <div className="table-responsive">
                        <table className="table mb-4">
                            <thead>
                                <tr>
                                   {/*  <th scope="col">
                                        <label>Id</label>
                                    </th>
                                    <th scope="col">
                                        <label>Order id</label>
                                    </th> */}
                                    <th scope="col">
                                        <label>Order Type</label>
                                    </th>
                                    {/* <th scope="col">
                                        <label>Type Id</label>
                                    </th> */}
                                    <th scope="col">
                                        <label>Amount</label>
                                    </th>
                                    {/* <th scope="col">
                                        <label>Discount</label>
                                    </th> */}
                                   {/*  <th scope="col">
                                        <label>Total Amount</label>
                                    </th> */}
                                    <th scope="col">
                                        <label>Added Date</label>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {itemsList}
                            </tbody>
                        </table>
                    </div>


                </div>

            </Modal.Body>
        </Modal>
    );
};
export default OrderPaymentItemsModal;
