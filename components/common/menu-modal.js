import { useEffect, useState } from "react";
import { Collapse } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import Link from "next/link";
import router from "next/router";
const MenuModal = ({ modalShow, handleClose, menus }) => {
  const [fullscreen, setFullScreen] = useState(true);
  const [browseAllState, setBrowseAllState] = useState(false);
  const [optState, setOptState] = useState({});

  useEffect(() => {
    menus.response.data
      ? menus.response.data.map((data) => {
          setOptState({ ...optState, [data.id]: false });
        })
      : null;
  }, [menus.response.data]);

  let category = menus.response.data
    ? menus.response.data.map((data) => (
        <div key={data.id} className="nav-head">
          <div
            // onClick={() =>
            //   router.push({ pathname: "/cards/category/" + data.slug })
            // }
            onClick={() =>
              setOptState({ ...optState, [data.id]: !optState[data.id] })
            }
          >
            <label>{data.name}</label>
            {optState[data.id] ? (
              <img src="/images/drop-icon.svg" />
            ) : (
              <img src="/images/chevron-right.svg" />
            )}
          </div>
          <Collapse in={optState[data.id]}>
            <div className="sub-nav">
              {data.children
                ? data.children.map((data) => (
                    <div
                      key={data.id}
                      onClick={() =>
                        router.push({
                          pathname: "/cards/category/" + data.slug,
                        })
                      }
                    >
                      {data.name}
                    </div>
                  ))
                : null}
            </div>
          </Collapse>
        </div>
      ))
    : null;
  return (
    <Modal
      show={modalShow}
      fullscreen={fullscreen}
      backdropClassName="fullscreen-modal-backdrop"
      contentClassName="fullscreen-modal-content"
      dialogClassName="fullscreen-modal-dialog"
      keyboard={true}
      onHide={handleClose}
    >
      {/* <Modal.Header>
        <Modal.Title>Modal</Modal.Title>
      </Modal.Header> */}
      <Modal.Body bsPrefix="fullscreen-modal-body">
        <div className="nav-div">
          <div onClick={() => router.push("/")}>Home</div>
          <div>
            <div
              id="nav-div-collapse"
              onClick={() => setBrowseAllState(!browseAllState)}
            >
              <label>Browse</label>{" "}
              {browseAllState ? (
                <img src="/images/drop-icon.svg" />
              ) : (
                <img src="/images/chevron-right.svg" />
              )}
            </div>

            <div
              className="collapse-div"
              style={
                browseAllState ? { display: "block" } : { display: "none" }
              }
            >
              <Collapse in={browseAllState}>
                <div>{category}</div>
              </Collapse>
            </div>
          </div>
          <div onClick={() => router.push("/about-us")}>About Us</div>
          <div onClick={() => router.push("/pricing")}>Pricing</div>
          <div onClick={() => router.push("/contact-us")}>Contact Us</div>
          <div>Ecard For Business</div>
        </div>
      </Modal.Body>
      <Modal.Footer bsPrefix="nav-modal-footer">
        <img
          src="/images/close-nav.svg"
          id="nav-close-icon"
          onClick={handleClose}
        />
        <div>
          <a href="https://www.facebook.com/OjolieCards" target="_blank">
            <img src="/images/facebook-icon.svg" />
          </a>
          <a href="https://www.pinterest.com/ojolie/" target="_blank">
            <img src="/images/pinterest-icon.svg" />
          </a>
          <a href="https://www.instagram.com/ojolie.ecards" target="_blank">
            <img src="/images/instagram-icon.svg" />
          </a>
          {/* <img src="/images/youtube-icon.svg" /> */}
        </div>
      </Modal.Footer>
    </Modal>
  );
};
export default MenuModal;
