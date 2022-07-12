import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import ReactPaginate from 'react-paginate';
import LoadingScreen from "../../components/common/loader";
import {PAGINATION_LENGTH} from '../../store/type'

const ReciepentListModal = ({ showModal, handleClose, data , socialShare }) => {
    const [recipents,setRecipient] = useState([]);
    const [order_name, setOrder] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [currentItems, setCurrentItems] = useState(null);
    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);  
    const itemsPerPage=PAGINATION_LENGTH;      
    useEffect(() => { 
        setRecipient(data ?? []);
      }, [data]);

    useEffect(() => {
      // Fetch items from another resources.
      const endOffset = itemOffset + itemsPerPage;
      setCurrentItems(recipents.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(recipents.length / itemsPerPage));
      
    }, [itemOffset, itemsPerPage ,recipents]);
  
    // Invoke when user click to request another page.
    const handlePageClick = (event) => { console.log(event)
      let selectedpage  =event.selected ? event.selected : event.selected
      const newOffset = (selectedpage * itemsPerPage) % recipents.length;
      setItemOffset(newOffset);      
    };
    
    const sortbyName = () => {
      //console.log('sortbyName')
      order_name == 1 ? setOrder(0) : setOrder(1)
      let list = [...recipents];
      order_name == 1 ?
        list.sort((a, b) => (a.fname > b.fname ? 1 : -1))
        : list.sort((a, b) => (a.fname < b.fname ? 1 : -1))
      setRecipient(list);
    }
    const sortbyEmail = () => {
      order_name == 1 ? setOrder(0) : setOrder(1)
      let list = [...recipents];
      order_name == 1 ?
        list.sort((a, b) => (a.email > b.email ? 1 : -1))
        : list.sort((a, b) => (a.email < b.email ? 1 : -1))
        setRecipient(list);
    }
    return (
    <>
      <Modal
        show={showModal}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className="reply-sent-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Tracking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="address-book-body">
              <h3  className="tracking-page-title">Shared on Social Media & via Link</h3>
              <div className="input-container">
                <table className="table mb-4">
                <thead>
                    <tr>
                    <th scope="col">
                        <label>Type</label>
                      </th>
                      <th scope="col">
                        <label>Status</label>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                  <tr><td>Facebook</td><td>Shared {socialShare.facebook} times</td></tr>
                  <tr><td>Twitter</td><td>Shared {socialShare.twitter} times</td></tr>
                  <tr><td>Linkdin</td><td>Shared {socialShare.linkdin} times</td></tr>
                  <tr><td>Link</td><td>Shared {socialShare.link} times</td></tr>
                  </tbody>
                </table>
                </div>
                </div>
        <div className="address-book-body">
              <h3  className="tracking-page-title">Sent by Email</h3>
              <div className="input-container">




                <table className="table mb-4">
                  <thead>
                    <tr>

                      <th scope="col" onClick={(event) => sortbyName(event)}>
                        <label>Name</label>
                        <img src="/assets/image/sort.svg" />
                      </th>
                      <th scope="col" onClick={(event) => sortbyEmail(event)}>
                        <label>Email</label>
                        <img src="/assets/image/sort.svg" />
                      </th>
                      <th scope="col" onClick={(event) => sortbyStatus(event)}>
                        <label>Status</label>
                        <img src="/assets/image/sort.svg" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipents ?
                      currentItems &&
                      currentItems.map((e, i) => {
                        return (
                          <tr key={e.id}>

                            <td>
                              <label>{e.name}</label>
                            </td>
                            <td>
                              <label>{e.email}</label>
                            </td>
                            <td>
                            {e.count_view > 0 ? 'opened' : 'send'}
                            </td>
                          </tr>
                        );
                      })
                      : <tr><td>No Record Available.</td></tr>
                    }

                  </tbody>
                </table>
                <nav aria-label="Page navigation comments" className="mt-4">
                    <ReactPaginate
                      previousLabel="previous"
                      nextLabel="next"
                      breakLabel="..."
                      breakClassName="page-item"
                      breakLinkClassName="page-link"
                      pageCount={pageCount}
                      pageRangeDisplayed={4}
                      marginPagesDisplayed={2}
                      onPageChange={(e)=>handlePageClick(e)}
                      containerClassName="pagination justify-content-center"
                      pageClassName="page-item"
                      pageLinkClassName="page-link"
                      previousClassName="page-item"
                      previousLinkClassName="page-link"
                      nextClassName="page-item"
                      nextLinkClassName="page-link"
                      activeClassName="active"
                      // eslint-disable-next-line no-unused-vars
                      hrefBuilder={(page, pageCount, selected) =>
                        page >= 1 && page <= pageCount ? `/page/${page}` : '#'
                      }
                      hrefAllControls
                      forcePage='1'
                      onClick={(clickEvent) => {
                        console.log('onClick', clickEvent);
                      }}
                    />
                  </nav>                
              </div>


              
         

          
        </div>
        </Modal.Body>
      </Modal>
    </>
  );

}

export default ReciepentListModal;