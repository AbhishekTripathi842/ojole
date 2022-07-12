import React, { useEffect, useReducer, useState } from "react";
import { Modal } from "react-bootstrap";
import {
  deleteAddressBook,
  getAddressBookByGroup,
  getAddressBookList,
  getAddressGroupList,
} from "../../api/AddressBookAPI";
import {
  useAPIRequest,
  useAPIRequestWithPayload,
} from "../../shared/api-request-hook";
import { initalState, reducer } from "../../shared/default-reducer";

import AddressGroupModal from "../../components/common/address-group-model";
import ReactPaginate from 'react-paginate';
import LoadingScreen from "../../components/common/loader";
import {PAGINATION_LENGTH} from '../../store/type'

const AddressBookModal = ({
  sendList,
  showModal,
  handleClose,
  showGroupAssign,
}) => {
  const [addressList, setAddressList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [order_name, setOrder] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [deletedIndex, setDeletedIndex] = useState();
  const [filter_keyword, setFilterKeyword] = useState('');
  const [addressBookModal, setAddressBookModal] = useState(false);
  const [addressGroupModal, setAddressGroupModal] = useState(false);
  const [errorList, setErrorList] = useState(false);
  // We start with an empty list of items.
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);  
  const itemsPerPage=PAGINATION_LENGTH;  
  const [addressListState, addressListDispatch] = useReducer(
    reducer,
    initalState
  );

  const [groupListState, groupListDispatch] = useReducer(reducer, initalState);

  const [filterBookState, filterBookDispatch] = useReducer(
    reducer,
    initalState
  );

  const [deleteAddressState, deleteAddressDispatch] = useReducer(
    reducer,
    initalState
  );

  const [loadAddressGroups] = useAPIRequest(
    groupListDispatch,
    getAddressGroupList
  );

  const [loadAddressBooks] = useAPIRequest(
    addressListDispatch,
    getAddressBookList,
    filter_keyword
  );

  const [filterAddress] = useAPIRequestWithPayload(
    filterBookDispatch,
    getAddressBookByGroup
  );

  const [deleteAddress] = useAPIRequestWithPayload(
    deleteAddressDispatch,
    deleteAddressBook
  );

  useEffect(() => {
    loadAddressGroups();
    setFilterKeyword('')
    //loadAddressBooks();
  }, []);

  useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + itemsPerPage;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    console.log(addressList)
    setCurrentItems(addressList.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(addressList.length / itemsPerPage));
    
  }, [itemOffset, itemsPerPage ,addressList]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => { console.log(event)
    let selectedpage  =event.selected ? event.selected : event.selected
    const newOffset = (selectedpage * itemsPerPage) % addressList.length;
    console.log(
      `User requested page number ${event.selected} , which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
    
  };

  useEffect(() => {
    if (groupListState.success && groupListState.response.data) {
      setGroupList(groupListState.response.data.data ?? []);
    }
  }, [groupListState]);

  useEffect(() => {
    if (addressListState.success && addressListState.response.data) {
      checkAndCleanList(addressListState.response.data.data ?? []);
    }
  }, [addressListState]);

  useEffect(() => {
    if (filterBookState.success && filterBookState.response.data) {
      checkAndCleanList(filterBookState.response.data.data.addressbooks ?? []);
    }
  }, [filterBookState]);

  useEffect(() => {
    if (deleteAddressState.success && deleteAddressState.response.data) {
      let list = [...addressList];
      if (deletedIndex) {
        list.splice(deletedIndex, 1);
      }
      setAddressList(list);
      setDeletedIndex(null);
      addressListDispatch({});
    }
  }, [deleteAddressState]);

  useEffect(() => {
    setFilterKeyword('')
    setSelectedGroup(0)
    if (showModal) {

      loadAddressBooks();
    }
  }, [showModal]);

  function filterByGroup(event) {
    let groupId = event.target.value;

    if (groupId > 0) {
      filterAddress(groupId);
    } else {
      loadAddressBooks();
    }

    setSelectedGroup(groupId);
  }

  function handleCheckAddress(event, index) {// alert(index)
    let list = [...addressList];
    const finditem=index
    if (index == -1) {
      list
        .filter((e) => !e.disabled)
        .forEach((a) => {
          a.checked = event.target.checked;
        });
    } else { //alert(finditem)
      //list[index].checked = event.target.checked;
      
      let index = list.findIndex((item)=>item.id==finditem) 
      list[index].checked = event.target.checked;
      setAddressList(list);      
    }
    setAddressList(list);
  }

  function addToSendList() {
    let list = addressList
      .filter((e) => e.checked)
      .map((e) => {
        return { id:e.id,name: e.fname, email: e.email.trim() };
      });

    if (list.length <= 0) {
      return;
    }

    handleClose(list);
  }

  const addToGroupList = () => {
    setErrorList(false)
    let list = addressList
      .filter((e) => e.checked)
      .map((e) => {
        return { name: e.fname, email: e.email.trim() };
      });

    if (list.length <= 0) {
      setErrorList(true)

      return;
    }

    setAddressGroupModal(true)
  }

  function checkAndCleanList(dataList) {
    let list = [...dataList];
    list.forEach((e) => {
      if (e.checked) {
        delete e.checked;
      }
      e.disabled = sendList.some((a) => e.email.trim() == a.email.trim());
    });

    setAddressList(list);
  }

  const sortbyName = () => {
    console.log('sortbyName')
    order_name == 1 ? setOrder(0) : setOrder(1)
    let list = [...addressList];
    order_name == 1 ?
      list.sort((a, b) => (a.fname > b.fname ? 1 : -1))
      : list.sort((a, b) => (a.fname < b.fname ? 1 : -1))
    setAddressList(list);
  }
  const sortbyEmail = () => {
    order_name == 1 ? setOrder(0) : setOrder(1)
    let list = [...addressList];
    order_name == 1 ?
      list.sort((a, b) => (a.email > b.email ? 1 : -1))
      : list.sort((a, b) => (a.email < b.email ? 1 : -1))
    setAddressList(list);
  }
  //filter_keyword
  useEffect(() => {

    loadAddressBooks(filter_keyword)
  }, [filter_keyword]);

  return (
    <React.Fragment>
      <Modal show={showModal} onHide={handleClose} className="address-book-modal">
        <Modal.Header closeButton>
          <Modal.Title>Address book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="address-book-body">
            <form>
              <div className="input-container">
                <img
                  style={{ marginBottom: "40px" }}
                  src="/assets/image/address-book.svg"
                />

                <div className="mail-list-head-div">
                  <div className="select-div">
                    <select value={selectedGroup} onChange={filterByGroup}>
                      <option value={0}>Filter by Email Groups</option>
                      {groupList &&
                        groupList.map((e) => {
                          return (
                            <option key={e.id} value={e.id}>
                              {e.name}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                  <div className="search-div">
                    <img src="/assets/image/search-icon.svg" />
                    <input type="text" placeholder="Search..." onChange={(e) => setFilterKeyword(e.target.value)} />
                  </div>
                </div>

                <table className="table mb-4">
                  <thead>
                    <tr>
                      <th scope="col">
                        <input
                          type="checkbox"
                          style={{ all: "revert" }}
                          onChange={(event) => handleCheckAddress(event, -1)}
                        />
                      </th>
                      <th scope="col" onClick={(event) => sortbyName(event)}>
                        <label>Name</label>
                        <img src="/assets/image/sort.svg" />
                      </th>
                      <th scope="col" onClick={(event) => sortbyEmail(event)}>
                        <label>Email</label>
                        <img src="/assets/image/sort.svg" />
                      </th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems ?
                      currentItems &&
                      currentItems.map((e, i) => {
                        return (
                          <tr key={e.id}>
                            <td scope="row">
                              <input
                                disabled={e.disabled}
                                type="checkbox"
                                style={{ all: "revert" }}
                                checked={e.checked ?? false}
                                onChange={(event) => handleCheckAddress(event, e.id)}
                              />
                            </td>
                            <td>
                              <label>{e.fname}</label>
                            </td>
                            <td>
                              <label>{e.email}</label>
                            </td>
                            <td>
                              <img
                                src="/assets/image/trash-icon.svg"
                                hidden={e.disabled}
                                onClick={() => {
                                  swal({
                                    title: "Are you sure?",
                                    text: "You want to delete address data!",
                                    type: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: '#DD6B55',
                                    confirmButtonText: 'Yes, I am sure!',
                                    cancelButtonText: "No, cancel it!"
                                  }).then(
                                    function (res) { /*Your Code Here*/
                                      if (res) {
                                        setDeletedIndex(i);
                                        deleteAddress(e.id);
                                      }
                                    },
                                  );

                                }}
                              />
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

              <div className="button-container">
                <button className="button-outline" type="button" onClick={addToGroupList}>
                  Add to Group
              </button>
                <button type="button" onClick={addToSendList}>
                  Add Receipients ({addressList.filter((e) => e.checked).length})
              </button>
              
            </div>
            {
              errorList ? <p className="error-style-p">Please select a contact in the address list.</p> : '' 
            }
          </form>
        </div>
      </Modal.Body>
    </Modal>
    <AddressGroupModal
        showModal={addressGroupModal}
        groupLists={groupList}
        addressList={addressList}
        handleClose={() => setAddressGroupModal(false)}

      />
    </React.Fragment>
  );
};
export default AddressBookModal;
