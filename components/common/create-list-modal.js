import { useEffect, useReducer, useState } from "react";
import { Modal } from "react-bootstrap";
import { assignToGroup } from "../../api/AddressBookAPI";
import { useAPIRequestWithPayload } from "../../shared/api-request-hook";
import { initalState, reducer } from "../../shared/default-reducer";
const CreateListModal = ({
  groupList,
  addressList,
  showModal,
  handleClose,
}) => {
  const [list, setList] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [group, setGroup] = useState({});
  const [state, dispatch] = useReducer(reducer, initalState);
  const [assignGroup] = useAPIRequestWithPayload(dispatch, assignToGroup);
  const [addedCount, setAddedCount] = useState();
  const [error,setError]=useState('');

  useEffect(() => {
    setList(groupList ?? []);
  }, [groupList]);

  useEffect(() => {
    setAddresses(addressList ?? []);
  }, [addressList]);

  useEffect(() => {
    setGroup({});
    setError('')
    setAddedCount(null);
  }, [showModal]);

  useEffect(() => {
    if (state.success) {
      dispatch({});
      handleClose(addedCount);
    }
  }, [state]);

  useEffect(()=>{

  },[error])

  function assignSelected(event) {
    event.preventDefault();

    if (!group.id ) { 
      setError('You have not selected any group')
      return;
    }

    if (addresses.length <= 0) {
      setError('You have not selected any address')
      return;
    }

    let list = addresses
      .filter((a) => {
        return !a.addressbook_group_ids.some((gid) => gid == group.id);
      })
      .map((a) => a.id);

    if (list.length == 0) {
      dispatch({});
      handleClose(0);
      return;
    }

    setAddedCount(list.length);

    let data = {
      addressbook_id: list,
      addressbook_group_id: group.id,
    };

    assignGroup(data);
  }

  return (
    <Modal show={showModal} onHide={handleClose} className="create-list-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          Select group to add contacts to. Go to your account if you want to
          create a new group.
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="create-list-body">
          <form onSubmit={assignSelected}>
            {/* <div className="input-container">
            </div> */}
            <ul className="list-group mb-4">
              {list &&
                list.map((e) => {
                  return (
                    <li className="list-group-item" key={e.id}>
                      <input
                        type="radio"
                        checked={e.id == group.id}
                        onChange={() => setGroup(e)}
                        className="form-check-input me-2"
                        style={{ all: "revert" }}
                      />
                      {e.name}
                    </li>
                  );
                })}
            </ul>
            <div className="button-container">
              <button
                type="button"
                className="button-outline"
                onClick={handleClose}
              >
                CANCEl
              </button>
              <button>ADD TO GROUP</button>
            </div>
          </form>
          {error && (
                        <p className="error-style-p">
                          {error}
                        </p>
                      )}
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default CreateListModal;
