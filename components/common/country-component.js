import { Modal } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { countryList } from "../../utils";
import router from "next/router";
const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

const CountryComponent = ({ showModal, closeModal, year , duration , duration_type }) => {
  const [selectedCountry, setSelectedCountry] = useState("");

  useEffect(() => {
    setSelectedCountry("");
  }, []);

  const handleChange = (selectedOptions) => setSelectedCountry(selectedOptions);

  return (
    <Modal
      show={showModal}
      onHide={closeModal}
      onEnter={() => setSelectedCountry("")}
      className="country-select-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Select your country
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="country-select-body">
          <Select
            options={countryList}
            onChange={handleChange}
            value={selectedCountry}
          />
        </div>
      </Modal.Body>
      <Modal.Footer bsPrefix="country-modal-footer">
        <button
          id="continue"
          onClick={() => {
            if (selectedCountry !== "") {
              router.push({
                pathname: "/check-out",
                query: {
                  //year: year,
                  duration: duration,
                  duration_type: duration_type,
                  countryCode: selectedCountry.value,
                  currency: selectedCountry.currency,
                },
              });
            }
          }}
        >
          Next
        </button>
      </Modal.Footer>
    </Modal>
  );
};
export default CountryComponent;
