import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Calendar from "react-calendar";
import TimezoneSelect from "react-timezone-select";

const ScheduleCalendarModal = ({
  showModal,
  handleClose,
  timezone,
  date,
  onChange,
}) => {
  const [selectedTimezone, setSelectedTimezone] = useState(timezone);
  const [selectedDate, setSelectedDate] = useState(date);

  useEffect(() => {
    if (showModal) {
      setSelectedTimezone(timezone);
      setSelectedDate(date);
    }
  }, [showModal]);

  function handleSave() {
    onChange(selectedTimezone, selectedDate);
    handleClose();
  }

  function closeModal(result) {
    handleClose(result);
  }

  return (
    <Modal
      show={showModal}
      onHide={() => closeModal(false)}
      className="schedule-calendar-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Select the date and timezone</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        <div className="schedule-calendar-body">
          <div className="schedule-calendar-container">
            <div className="row">
              <div className="time-zone-selector">
                <TimezoneSelect
                  instanceId="timezone"
                  value={selectedTimezone}
                  onChange={setSelectedTimezone}
                />
              </div>
              <div className="calendar-selector">
                <Calendar
                  className="calendar"
                  value={selectedDate}
                  onChange={setSelectedDate}
                />
              </div>
            </div>
          </div>
          <div className="schedule-date">{selectedDate.toDateString()}</div>
          <button className="save-btn" onClick={handleSave}>
            SAVE DATE
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default ScheduleCalendarModal;
