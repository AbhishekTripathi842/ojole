import { Modal } from "react-bootstrap";
import { useEffect, useReducer, useState } from "react";
import validator from "validator";
import { initalState, reducer } from "../../shared/default-reducer";
import { useAPIRequestWithPayload } from "../../shared/api-request-hook";
import { importContactList } from "../../api/AddressBookAPI";

const ImportContactsModal = ({ showModal, handleClose }) => {
  const [multiImportContacts, setImportContacts] = useState("");
  const [contactList, setContactList] = useState([]);
  const [importState, importDispatch] = useReducer(reducer, initalState);
  const [contactError,setContactError]=useState(false);
  const [contactErrormsg,setContactErrorMsg]=useState('');
  const [invokeImport] = useAPIRequestWithPayload(
    importDispatch,
    importContactList
  );

  useEffect(() => {
    if (importState.success) {
      setImportContacts("");
      handleClose(contactList);
      importDispatch({});
    }
  }, [importState]);

  function handleAdd() { 
    let array = multiImportContacts.split("\n");
    setContactError(false)
    setContactErrorMsg('')
    if (!array || array.length == 0) {
      alert()
      return;
    }

    let contacts = [];

    for (let c of array) {
      try {
        let [name, email] = c.split(",");
        if (name && email && validator.isEmail(email.trim())) {
          contacts.push({ name: name, email: email.trim() });
        }
      } catch {}
    }
    if (contacts.length == 0) { 
      setContactError(true)
      setContactErrorMsg('Please provide the contact list.')
      return;
    }

    setContactList(contacts);

    //setImportContacts("");
    //handleClose(contacts);
    invokeImport({
      contact_data: contacts.map((e) => `${e.name}, ${e.email}`),
    });
  }

  return (
    <Modal
      show={showModal}
      onHide={() => {
        setImportContacts("");
        importDispatch({});
        handleClose();
      }}
      className="import-contacts-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>IMPORT CONTACTS</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="import-contacts-body">
          <form>
            <div className="input-container">
              <img
                style={{ marginBottom: "40px" }}
                src="/assets/image/address-book.svg"
              />
              {importState.error && (
                <p className="text-danger">{importState.message}</p>
              )}
              {
                contactError &&(
                  <p className="text-danger">{contactErrormsg}</p>
                )
              }
              <p>
                To import contact, use the following format: name, email. The
                first field is the name. The second field is the email. The name
                and the email are separated by a comma. Each contact is
                separated by a line break.{" "}
              </p>
              <textarea
                id="multi-import"
                type="text"
                value={multiImportContacts}
                placeholder="To import contact, use the following format: name, email. The first field is the name.
                  The second field is the email. The name and the email are separated by a comma. 
                  Each contact is separated by a line break.&#13; &#10;Here is an example.&#13; &#10;john, john@yahoo.com&#10;mary smith, smith@hi.com"
                onChange={(e) => setImportContacts(e.target.value)}
              />
            </div>
            <div className="button-container">
              <button type="button" onClick={handleAdd}>
                Add contacts
              </button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default ImportContactsModal;
