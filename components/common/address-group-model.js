import { useEffect, useReducer, useState } from "react";
import { Modal } from "react-bootstrap";
import {
  deleteAddressBook,
  getAddressBookByGroup,
  getAddressBookList,
  getAddressGroupList,
} from "../../api/AddressBookAPI";
import { assignToGroup } from "../../api/AddressBookAPI";
import {
    useAPIRequest,
    useAPIRequestWithPayload,
  } from "../../shared/api-request-hook";
  import { initalState, reducer } from "../../shared/default-reducer";

import swal from "sweetalert";

const AddressGroupModal = ({ groupLists,addressList, showModal, handleClose,showGroupAssign }) => {  

    const [state, dispatch] = useReducer(reducer, initalState);
    const [assignGroup] = useAPIRequestWithPayload(dispatch, assignToGroup);
    const [groupList, setGroupList] = useState([]);

    useEffect(()=>{ 
        setGroupList(groupLists)
    });

    useEffect(()=>{  console.log('groupList')
        console.log(groupList)
    },[groupList])
    
    const addToGroup = async () =>{

        let list = addressList
        .filter((e) => e.checked)
        .map((e) => {
          return e.id;
        });
  
        if (list.length <= 0 || groupList.length <=0) {
          swal("No group have selected.")
            return;
        }

        let glist = [...groupList];

        let group = groupList
        .filter((e) => e.checked)
        .map((e) => {
          return {id:e.id};
        });

        console.log(group, list)

        let data = {
            addressbook_id: list,
            addressbook_group_id: group && group[0] && group[0].id,
          };
      
        assignGroup(data);


        swal('Contact added to group successfully').then(function() {
            closeModelHandler()
        })
       // closeModelHandler()
    }     
    const handleCheckGroup = (event,index) =>{
        let list = [...groupList];
        if (index == -1) { console.log('if')
          list
            .filter((e) => !e.disabled)
            .forEach((a) => {
              a.checked = false;
            });
        } else {
            console.log('else')
            list
            .forEach((a) => {
              a.checked = false;
            });
          list[index].checked = event.target.checked;
        }
        console.log(list)
        setGroupList(list);
        
    }

    const closeModelHandler = () =>{

        let list = [...groupList];
          list
            .forEach((a) => {
              a.checked = false;
            });    
        setGroupList(list)
        handleClose();
    }
    
    return (
        <Modal show={showModal} onHide={closeModelHandler} className="create-list-modal">
          <Modal.Header closeButton>
            <Modal.Title>Select group to add contacts to. Go to your account if you want to create a new group.</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div className="address-book-body">
          <form>
            <div className="input-container">
          <table className="table mb-4">
                <thead>
                  <tr>
                    <th scope="col">
                      {/* <input
                        type="checkbox"
                        style={{ all: "revert" }}
                        
                      /> */}
                    </th>
                    <th scope="col">
                      <label>Name</label>
                      <img src="/assets/image/sort.svg" />
                    </th>
                    
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
          {groupList ?
                  groupList &&
                  groupList.map((e, i) => {
                      return (
                        <tr key={e.id}>
                            <td scope="row">
                            <input
                              disabled={e.disabled}
                              type="radio"
                              style={{ all: "revert" }}
                              checked={e.checked ?? false}
                              onChange={(event) => handleCheckGroup(event, i)}
                            />
                          </td>
                            <td >{e.name}</td></tr>
                      );
                    })
                    : <tr><td>No Record Available.</td></tr>
                    }
                </tbody>
              </table>          
              </div>          
              <div className="button-container">
                <button className="button-outline"  type="button" onClick={ closeModelHandler} >
                        Cancel
                </button>
                <button type="button"  type="button" onClick={ addToGroup } >
                    Add to Group
                </button>              
            </div>           
          </form>
        </div>
          </Modal.Body>
        </Modal>
      );
  };

  export default AddressGroupModal;