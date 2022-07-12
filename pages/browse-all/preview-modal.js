import router from "next/router";
import Router from "next/router";
import { Modal } from "react-bootstrap";
import VimeoPlayer from "react-player/vimeo";
import Cookies from "universal-cookie";
import { SEND_CARD_DATA } from "../create-card";

const cookies = new Cookies();
const user = cookies.get("type");

const PreviewCardModal = ({ showModal, handleClose, data, editData, type }) => {
  const redirect = (data) => {
    if (type === "product") {
      window.sessionStorage.setItem(
        SEND_CARD_DATA,
        JSON.stringify({
          id: data.id,
        })
      );
      router.push({
        pathname: "/create-card",
      });
    } else {
      router.push({ pathname: "/product", query: { id: data.id } });
    }
  };
  return (
    <Modal
      size="xl"
      show={showModal}
      onHide={handleClose}
      aria-labelledby="example-modal-sizes-title-lg"
      dialogClassName="preview-modal"
    >
      <Modal.Header closeButton>
        {type !== "preview" &&
          ( parseInt(data.private) === 1 ? (
            <Modal.Title id="example-modal-sizes-title-lg">
              <img src="/assets/image/card-preview-diamond.svg" />
              PREMIUM CARD
            </Modal.Title>
          ) : (
            <Modal.Title id="example-modal-sizes-title-lg">
              FREE CARD
            </Modal.Title>
          ))}
      </Modal.Header>
      <Modal.Body>
        <div className="card-preview-body-div mb-5">
          <div className="row">
            <div className="col-md-7">
              <div className="video-container">
                {/* <img src={`${data.thumbnail}`} /> */}
                {data && (
                  <VimeoPlayer
                    url={`https://vimeo.com/${data.video}`}
                    width="100%"
                    height="100%"
                    controls
                    playsinline={true}
                  />
                )}
              </div>
            </div>
            <div className="col-md-5">
              {type !== "preview" ? (
                <div className="right-column mt-4 mt-md-0">
                  <h4>{data.caption}</h4>
                  <p>{data.detail}</p>

                  <div className="button-div">
                    <button
                      onClick={() =>
                        data.private === "1" && user === "0"
                          ? router.push("/pricing")
                          : redirect(data)
                      }
                    >
                      customize card
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="right-column mt-4 mt-md-0"
                  style={{ justifyContent: "flex-start" }}
                >
                  <div
                    dangerouslySetInnerHTML={{ __html: editData.greeting }}
                  ></div>
                  <div
                    dangerouslySetInnerHTML={{ __html: editData.message }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default PreviewCardModal;
