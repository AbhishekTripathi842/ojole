import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useReducer, useState } from "react";
import { connect } from "react-redux";
import Cookies from "universal-cookie";
import {PAGINATION_LENGTH} from '../../store/type'
import validator from "validator";
import {
  createAddressBook,
  createAddressGroup,
  deleteAddressBook,
  deleteAddressGroup,
  deleteMultipleAddressBook,
  getAddressBookByGroup,
} from "../../api/AddressBookAPI";
import AuthenticatedRoute from "../../components/authenticateRoute";
import ConfirmAddedModal from "../../components/common/confirm-added-modal";
import CreateListModal from "../../components/common/create-list-modal";
import FooterComponent from "../../components/common/footer";
import Header from "../../components/common/header";
import ImportContactsModal from "../../components/common/import-contacts-modal";
import ProfileMenu from "../../components/common/profile-menu";
import { useAPIRequestWithPayload } from "../../shared/api-request-hook";
import { initalState, reducer } from "../../shared/default-reducer";
import { AddressBookListAction } from "../../store/actions/address-book-list-action";
import { AddressGroupListAction } from "../../store/actions/adress-group-list-action";
import ReactPaginate from 'react-paginate';
import LoadingScreen from "../../components/common/loader";

const cookies = new Cookies();
function AddressBookPage({
  dispatch,
  addressGroupListResponse,
  addressBookListResponse,
  addAddressBookResponse,
}) {
  const router = useRouter();
  const itemsPerPage=PAGINATION_LENGTH;
  const [showGroupAssignModal, setShowGroupAssignModal] = useState(false);
  const [showAssignResultModal, setShowAssignResultModal] = useState(false);
  const [importContactsModal, setImportContactsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assignedCount, setAssignedCount] = useState();
  const [filter_keyword, setFilterKeyword] = useState('');
  const [groupErrorMsg,setGroupErrorMsg] = useState('');
  const [token, setToken] = useState("");
  const [filterGroupId, setFilterGroupId] = useState(0);
  const [order_name, setOrder] = useState(0);

  const [addressList, setAddressList] = useState([]);
  const [groupList, setGroupList] = useState([]);

  const [groupName, setGroupName] = useState();
  const [groupNameError, setGroupNameError] = useState();
  const [groupError,setGroupError]=useState(false);
  const [addressForm, setAddressForm] = useState({});
  const [addressFormError, setAddressFormError] = useState({});

  // We start with an empty list of items.
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);  

  const [groupState, groupDispatch] = useReducer(reducer, initalState);
  const [bookState, bookDispatch] = useReducer(reducer, initalState);
  const [filterBookState, filterBookDispatch] = useReducer(
    reducer,
    initalState
  );

  const [selectAllAddress, setSelectAllAddress] = useState(false);
  const [selectAllGroup, setSelectAllGroup] = useState(false);

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

  useEffect(()=>{ 
      console.log(currentItems)
      setTimeout(() => {
        setLoading(false)        
      }, 1000);
  },[currentItems,addressList])

  const [createGroup] = useAPIRequestWithPayload(
    groupDispatch,
    createAddressGroup
  );

  const [deleteGroup] = useAPIRequestWithPayload(
    groupDispatch,
    deleteAddressGroup
  );

  const [createAddress] = useAPIRequestWithPayload(
    bookDispatch,
    createAddressBook
  );

  const [deleteAddress] = useAPIRequestWithPayload(
    bookDispatch,
    deleteAddressBook
  );
  const [deleteMyiltipleAddress] = useAPIRequestWithPayload(
    bookDispatch,
    deleteMultipleAddressBook
  );


  const [filterAddress] = useAPIRequestWithPayload(
    filterBookDispatch,
    getAddressBookByGroup
  );

  useEffect(() => {
    if (!cookies.get("email")) {
      router.replace({ pathname: "/home" });
      return;
    }
    setLoading(true)
    dispatch(AddressGroupListAction());
    dispatch(AddressBookListAction());
  }, []);

  useEffect(() => {
    if (
      addressBookListResponse.success &&
      addressBookListResponse.response.data
    ) { 
      setAddressList(addressBookListResponse.response.data);
      setItemOffset(0)
    }
  }, [addressBookListResponse]);

  useEffect(() => {
    if (filterBookState.success && filterBookState.response.data) {
      setAddressList(filterBookState.response.data.data.addressbooks ?? []);
    }
  }, [filterBookState]);

  useEffect(()=>{
    //console.log('filter_keyword'+filter_keyword)
    setLoading(true)
    setItemOffset(1)
    dispatch(AddressBookListAction(filter_keyword))
    //console.log('filter_keyword'+filter_keyword)
    
  },[filter_keyword]);
  useEffect(() => {
    if (
      addressGroupListResponse.success &&
      addressGroupListResponse.response.data
    ) {
      setGroupError(false)
      setLoading(false)
      setGroupList(addressGroupListResponse.response.data);
      
    }
  }, [addressGroupListResponse]);

  useEffect(() => {
    if (groupState.success) {
      dispatch(AddressGroupListAction());
      setGroupName("");
    }
  }, [groupState]);

  useEffect(() => {
    if (bookState.success) {
      dispatch(AddressBookListAction());
      setAddressForm({});
    }
  }, [bookState]);

  function handleGroupInputChange(event) {
    setGroupName(event.target.value);
    setGroupNameError(null);
  }

  function handleAddressInputChange(event) {
    setAddressForm({
      ...addressForm,
      [event.target.name]: event.target.value,
    });

    setAddressFormError({
      ...addressFormError,
      [event.target.name]: null,
    });
  }
  const sortGroupByName = () => {
    order_name == 1 ? setOrder(0) : setOrder(1);
    let list = [...groupList];
    order_name == 1
      ? list.sort((a, b) => (a.fname > b.fname ? 1 : -1))
      : list.sort((a, b) => (a.fname < b.fname ? 1 : -1));
    setGroupList(list);
  };

  const sortbyName = () => {
    order_name == 1 ? setOrder(0) : setOrder(1);
    let list = [...addressList];
    order_name == 1
      ? list.sort((a, b) => (a.fname > b.fname ? 1 : -1))
      : list.sort((a, b) => (a.fname < b.fname ? 1 : -1));
    setAddressList(list);
  };
  const sortbyEmail = () => {
    order_name == 1 ? setOrder(0) : setOrder(1);
    let list = [...addressList];
    order_name == 1
      ? list.sort((a, b) => (a.email > b.email ? 1 : -1))
      : list.sort((a, b) => (a.email < b.email ? 1 : -1));
    setAddressList(list);
  }
  function deleteSelectedAddress(event) {
    event.preventDefault();
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
          setLoading(true)
          let list = addressList.filter((e) => !e.selected);
          setAddressList(list);
          {
            let list = addressList.filter((e) => e.selected);
            let output = [];
            for (var i=0; i < list.length ; ++i)
              output.push(list[i].id);            
            deleteMultipleAddressBook(output)  
          }
        }
      },
    );
  }
  const deleteContact = (id) =>{
    //deleteAddress(id)
    
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this contact!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, I am sure!',
      cancelButtonText: "No, cancel it!"
   }).then( 
          function (res) { /*Your Code Here*/ 
            if(res) { setLoading(true)
            deleteAddress(id)
            }
          },
        );
  }

  function addGroup() {
    setGroupNameError(null);
   
    if (!groupName || validator.isEmpty(groupName)) {
      setGroupNameError("Enter group name.");
      return;
    }
    setLoading(true)
    createGroup({ name: groupName });
  }

  function addAddress() {
    let error = {};

    if (validator.isEmpty(addressForm.name ?? "")) {
      error.name = "Enter full name.";
    }

    if (validator.isEmpty(addressForm.email ?? "")) {
      error.email = "Please enter email.";
    }else if (!validator.isEmail(addressForm.email ?? "")) {
      error.email = "Invalid email address.";
    }

    setAddressFormError(error);

    if (Object.keys(error).length > 0) {
      return;
    }

    let data = {
      fname: addressForm.name,
      lname: addressForm.name,
      email: addressForm.email,
    };
    setLoading(true)
    createAddress(data);
  }

  function toggleAddressSelection(selected) {
    let list = [...addressList];
    setSelectAllAddress(selected);
    for (let a of list) {
      a.selected = selected;
    }
    setAddressList(list);
  }

  function handleAddressSelection(key, selected) {
    let list = [...addressList];
//    list[index].selected = selected;
    const finditem=key
    let index = list.findIndex((item)=>item.id==finditem) 
    list[index].selected = selected;
    setAddressList(list);
  }

  function handleGroupSelection(index, selected) {
    let list = [...groupList];
    list[index].selected = selected;
    setGroupList(list);
  }

  function filterAddressList(groupId) {
    setSelectAllAddress(false);
    setLoading(true)
    setItemOffset(0)
    //let groupId = event.target.value;
    setFilterGroupId(groupId);
    if (groupId && groupId > 0) {
      filterAddress(groupId);
    } else {
      dispatch(AddressBookListAction());
    }
  }

  const showGroupModel=()=>{
    let address =addressList.filter((e) => e.selected);
    setGroupError(false)
    setGroupErrorMsg('')

    if(address.length){
      setShowGroupAssignModal(true)
    }else{
      setGroupError(true)
      setGroupErrorMsg('Plesae select any address to continue.');
      return false;
    }
    
  }

  return (
    <main>
      {loading ?
        <LoadingScreen></LoadingScreen> : ''
      }       
      <Head>
        <title>Address Book</title>
      </Head>
      <Header tokenData={(data) => setToken(data)} />
      <CreateListModal
        groupList={groupList}
        addressList={addressList.filter((e) => e.selected)}
        showModal={showGroupAssignModal}
        handleClose={(count) => {
          setShowGroupAssignModal(false);
          setAssignedCount(count);
          if (count >= 0) {
            setShowAssignResultModal(true);
          }
        }}
      />
      <ConfirmAddedModal
        count={assignedCount}
        showModal={showAssignResultModal}
        handleClose={() => {
          setShowAssignResultModal(false);
          setAssignedCount(0);
        }}
      />
      <ImportContactsModal
        showModal={importContactsModal}
        handleClose={(contacts) => {
          if (contacts && contacts.length > 0) {
            setFilterGroupId(0);
            dispatch(AddressBookListAction());
          }
          setImportContactsModal(false);
        }}
      />
      <div className="address-book-wrapper">
        <div className="address-book-container">
          <div className="row m-0">
            <div className="menu-section col-lg-3 p-0">
              <ProfileMenu tab="address-book" name="Address Book" />
            </div>
            <div className="main-section col-lg-9 p-0">
              <div className="left-div">
                <div className="email-group-container">
                  <h1>Email Group</h1>

                  <div className="address-input-div">
                    <div
                      className="address-full-name"
                      style={{ marginRight: "6px" }}
                    >
                      <label>Group Name<span className="required" style={{'display': 'contents'}}>*</span></label>
                      <input
                        type="text"
                        value={groupName ?? ""}
                        onChange={handleGroupInputChange}
                        placeholder="Write here..."
                      />
                    </div>
                    <button onClick={addGroup}>
                      <img src="/assets/image/add-email-icon.svg" />
                    </button>
                  </div>
                  {groupNameError && (
                    <p className="error-style-p">{groupNameError}</p>
                  )}
                  {groupState.error && (
                    <p className="error-style-p">{groupState.message}</p>
                  )}

                  <div className="table-head-div">
                    {/* <input type="checkbox" /> */}
                    <div className="name-div" style={{"marginLeft": "46px"}}>
                      <label>Name</label>
                      <img
                        src="/assets/image/sort.svg"
                        onClick={(event) => sortGroupByName(event)}
                      />
                    </div>

                    <div className="action-div"></div>
                  </div>

                  {groupList &&
                    groupList.map((e) => {
                      return (
                        <div className="list-container" key={e.id}>
                          <input type="checkbox" />
                          <label>{e.name}</label>
                          <img
                            className="cursor-hand"
                            src="/assets/image/trash-icon.svg"
                            onClick={() => swal({
                              title: "Are you sure?",
                              text: "You want to delete the group!",
                              type: "warning",
                              showCancelButton: true,
                              confirmButtonColor: '#DD6B55',
                              confirmButtonText: 'Yes, I am sure!',
                              cancelButtonText: "No, cancel it!"
                           }).then( 
                                  function (res) { /*Your Code Here*/ 
                                    if(res) {
                                      setLoading(true)
                                      deleteGroup(e.id)
                                    }
                                  },
                                )}
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
              <div className="right-div">
                <div className="book-add-container">
                  <h1>Address book</h1>

                  <img
                    className="import-contacts"
                    src="/assets/image/import-contacts.svg"
                    role="button"
                    onClick={() => {
                      setImportContactsModal(true);
                    }}
                  />

                  <div className="address-input-div">
                    <div
                      className="address-full-name"
                      style={{ marginRight: "25px" }}
                    >
                      <label>Full Name<span className="required" style={{'display': 'contents'}}>*</span></label>
                      <input
                        type="text"
                        name="name"
                        value={addressForm.name ?? ""}
                        onChange={handleAddressInputChange}
                        placeholder="Timothy Tu"
                      ></input>
                        {addressFormError.name && (
                          <p className="error-style-p">
                            {addressFormError.name}
                          </p>
                        )}
                    </div>
                    <div
                      className="address-full-name"
                      style={{ marginRight: "6px" }}
                    >
                      <label>Email<span className="required" style={{'display': 'contents'}}>*</span></label>
                      <input
                        type="text"
                        placeholder="timothytu@email.com"
                        name="email"
                        value={addressForm.email ?? ""}
                        onChange={handleAddressInputChange}
                      ></input>
                        {addressFormError.email && (
                          <p className="error-style-p">
                            {addressFormError.email}
                          </p>
                        )}
                    </div>
                    <div>
                      <button onClick={addAddress}>
                        <img src="/assets/image/add-email-icon.svg" />
                      </button>
                      {(addressFormError.name || addressFormError.email) && (
                        <p className="error-style-p">&nbsp;</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="book-list-container">
                  <div className="search-filter-icons-container">
                    <img
                      className="filter-icon"
                      src="/assets/image/filter-icon.svg"
                    />
                    <img
                      className="search-icon"
                      src="/assets/image/search-icon.svg"
                    />
                  </div>
                  <div className="mail-list-head-div">
                    <div className="select-div">
                      <select
                        value={filterGroupId}
                        onChange={(evt) => filterAddressList(evt.target.value)}
                      >
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
                      <input
                        type="text"
                        placeholder="Search..."
                        onChange={(e) => setFilterKeyword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="table-head-div">
                    <input
                      type="checkbox"
                      checked={selectAllAddress}
                      onChange={(e) => toggleAddressSelection(e.target.checked)}
                    />
                    <div className="name-div" onClick={(event) => sortbyName(event)}>
                      <label>Name</label>
                      <img src="/assets/image/sort.svg"  />
                    </div>
                    <div className="email-div" onClick={(event) => sortbyEmail(event)}>
                      <label>Email</label>
                      <img src="/assets/image/sort.svg" />
                    </div>
                    <div className="action-div"><a
                href="!#"
                className="float-end text-danger small"
                hidden={addressList.filter((e) => e.selected).length <= 0}
                onClick={deleteSelectedAddress}
              >
                <img src="/assets/image/trash-icon.svg" className="me-2" />
                Delete Selected
              </a></div>
                  </div>

                  {currentItems &&
                    currentItems.map((e, i) => {
                      return (
                        <div className="table-div" key={e.id}>
                          <input
                            type="checkbox"
                            checked={e.selected ?? false}
                            onChange={(event) =>
                              handleAddressSelection(e.id, event.target.checked)
                            }
                          />
                          <div className="name-div">
                            <label>{e.fname}</label>
                          </div>
                          <div className="email-div">
                            <label>{e.email}</label>
                          </div>
                          <div className="action-div">
                            <img
                              src="/assets/image/trash-icon.svg"
                              onClick={() => deleteContact(e.id)}
                            />
                          </div>
                        </div>
                      );
                    })}
                    
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
                    
                  {addressGroupListResponse.success &&
      addressGroupListResponse.response.data.length ? 
                  <button onClick={() => showGroupModel()}>
                    Add to group 
                  </button>
                  :<div><button onClick={() =>{ setGroupErrorMsg('No group found. Please add a group first');setGroupError(true)}}>
                  Add to group 
                </button>
                  </div>
                  }
                  { groupError?<p className="error-style-p">{groupErrorMsg}</p>:''}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
    </main>
  );
}

export default AuthenticatedRoute(
  connect((state) => ({
    addressGroupListResponse: state.addressGroupListResponse,
    addressBookListResponse: state.addressBookListResponse,
    addAddressBookResponse: state.addAddressBookResponse,
  }))(AddressBookPage)
);
