import React, { useEffect, useReducer } from "react";
import Head from "next/head";
import Header from "../../components/common/header";
import Switch from "react-switch";
import { useState } from "react";
import FooterComponent from "../../components/common/footer";
import ProfileMenu from "../../components/common/profile-menu";
import ChangePasswordModal from "../../components/common/change-password-modal";
import Cookies from "universal-cookie";
import { useRouter } from "next/router";
import TimezoneSelect from "react-timezone-select";
import validator from "validator";
import { initalState, reducer } from "../../shared/default-reducer";
import { useAPIRequestWithPayload } from "../../shared/api-request-hook";
import { updateProfile } from "../../api/AccountAPI";
import AuthenticatedRoute from "../../components/authenticateRoute";
import withAuthentication from "../../shared/authenticated-component";
import store from "../../store/store";
import { ProfileAction } from "../../store/actions/profile-action";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingScreen from "../../components/common/loader";

const cookies = new Cookies();
const AccountPage = () => {
  const router = useRouter();
  
  const [cardSentChecked, setCardSentChecked] = useState(false);
  const [cardViewChecked, setCardViewChecked] = useState(false);
  const [messageRecipientChecked, setMessageRecipientChecked] = useState(false);
  const [specialOfferMailChecked, setSpecialOfferMailChecked] = useState(false);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({});
  const [selectedTimezone, setSelectedTimezone] = useState({});
  const [token, setToken] = useState("");
  const [profileState, dispatchUpdate] = useReducer(reducer, initalState);
  const [invokeUpdateProfile] = useAPIRequestWithPayload(
    dispatchUpdate,
    updateProfile
  );
  const [errors, setErrors] = useState({});
  const notify = () => toast("Your account has been updated successfully!");
  const dismissAll = () => toast.dismiss();

  useEffect(() => { 
    let loginData = cookies.get("email");
    console.log(loginData)
    if (!loginData) {
      router.replace({ pathname: "/home" });
      return;
    }

    let data = loginData.data;
    updateUI(data);
  }, []);

  useEffect(() => {
    dismissAll()
    console.log(profileState)
    if (profileState.success) {
      let response = profileState.response.data.data.response;

      store.dispatch(ProfileAction(cookies.get("token")));
      updateUI(response);
      notify();
      setTimeout(() => {
        setLoading(false);        
      }, 5000);
    }
    if(profileState.error){ //alert()
      setLoading(false);  
      toast(profileState.message)
    }
  }, [profileState]);

  function handleProfileChange(event) {
    setProfile({
      ...profile,
      [event.target.name]: event.target.value,
    });
  }

  function handleUpdateProfile() { dismissAll();
    let err = { ...errors };

    if (!profile.first_name || validator.isEmpty(profile.first_name)) {
      console.log("err " + validator.isEmpty(profile.first_name));
      err.first_name = "Please fill your First Name";
      setErrors(err);
    }else if(!validator.isAlphanumeric(profile.first_name)){
      err.first_name = "Please enter valid First Name";
      setErrors(err);
    } else {
      delete err.first_name;
      setErrors(err);
    }

    if (!profile.last_name || validator.isEmpty(profile.last_name)) {
      console.log("err " + validator.isEmpty(profile.last_name));
      err.last_name = "Please fill your Last Name";
      setErrors(err);
    }else if(!validator.isAlphanumeric(profile.last_name)){
      err.last_name = "Please enter valid Last Name";
      setErrors(err);
    } else {
      delete err.last_name;
      setErrors(err);
    }

    if (!profile.email || validator.isEmpty(profile.email)) {
      console.log("err " + validator.isEmpty(profile.email));
      err.email = "Please fill your Email";
      setErrors(err);
    } else if (!validator.isEmail(profile.email)) {
      console.log("err " + validator.isEmail(profile.email));
      err.email = "Invalid Email";
      setErrors(err);
      return;
    } else {
      delete err.email;
      setErrors(err);
    }


    let timezone = selectedTimezone.value;
    //alert()
    if (!timezone) {
      //console.log("err " + validator.isEmpty(profile.timezone));
      err.timezone = "Please select your timezone";
      setErrors(err);
    } else {
      delete err.timezone;
      setErrors(err);
    }    
    let data = {
      first_name: profile.first_name,
      last_name: profile.last_name,
      email: profile.email,
      timezone: timezone == "Asia/Rangoon" ? "Asia/Yangon" : timezone,
      notify_pickup: cardViewChecked ? 1 : 0,
      notify_sent: cardSentChecked ? 1 : 0,
      notify_reply: messageRecipientChecked ? 1 : 0,
      newsletter_subscribed: specialOfferMailChecked ? 1 : 0,
    };
    if (Object.keys(err).length === 0) {
      setLoading(true)
      invokeUpdateProfile(data);
    }
  }

  function updateUI(data) {
    let updatedProfile = { ...profile };
    updatedProfile["first_name"] = data.first_name;
    updatedProfile["last_name"] = data.last_name;
    updatedProfile["email"] = data.email;
//    updatedProfile["notify_pickup"] = data.notify_pickup;
    setSpecialOfferMailChecked(data.newsletter_subscribed)
    setCardSentChecked(data.notify_sent == "1");
    setCardViewChecked(data.notify_pickup == "1");
    setMessageRecipientChecked(data.notify_reply == "1");
    setSpecialOfferMailChecked(data.newsletter_subscribed == "1");
    setSelectedTimezone({
      value: data.timezone == "Asia/Yangon" ? "Asia/Rangoon" : data.timezone,
    });
    setProfile(updatedProfile);

    if (!data.details) {
      return;
    }

    setCardSentChecked(data.details.notify_sent == "1");
    setCardViewChecked(data.details.notify_pickup == "1");
    setMessageRecipientChecked(data.details.notify_reply == "1");
    setSpecialOfferMailChecked(data.details.newsletter_subscribed == "1");
    let timezone = data.details.timezone;
    if (timezone) {
      setSelectedTimezone({
        value: timezone == "Asia/Yangon" ? "Asia/Rangoon" : timezone,
      });
    } else {
      setSelectedTimezone({
        value: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    }
  }

  return (
    <main>
      {loading ?
        <LoadingScreen></LoadingScreen> : ''
      }        
      <ToastContainer progressStyle={{background:"#222c52"}} />
      <ChangePasswordModal
        showModal={changePasswordModal}
        handleClose={() => setChangePasswordModal(false)}
      />

      <Head>
        <title>Account</title>
      </Head>
      <Header tokenData={(data) => setToken(data)} />

      <div className="my-account-wrapper">
        <div className="my-account-container">
          <div className="row m-0">
            <div className="menu-section col-lg-3 p-0">
              <ProfileMenu tab="account" name="Account" />
            </div>
            <div className="main-section col-lg-9 p-0">
              <div className="row m-0">
                <div className="editname-container col-12 col-xl-6 col-md-6">
                  <h1>Full name</h1>
                  <div
                    className="input-container"
                    style={{ marginBottom: "28px" }}
                  >
                    <p>First name<span className="required">*</span></p>
                    <input
                      name="first_name"
                      value={profile.first_name ?? ""}
                      onChange={handleProfileChange}
                      maxlength="55"
                      placeholder=" "
                    />
                    {errors.first_name ? (
                      <p className="error-style-p">{errors.first_name}</p>
                    ) : null}
                  </div>
                  <div className="input-container">
                    <p>Last name<span className="required">*</span></p>
                    <input
                      name="last_name"
                      value={profile.last_name ?? ""}
                      onChange={handleProfileChange}
                      placeholder=" "
                      maxlength="55"
                    />
                    {errors.last_name ? (
                      <p className="error-style-p">{errors.last_name}</p>
                    ) : null}
                  </div>
                </div>
                <div className="accountinfo-container col-12 col-xl-6 col-md-6">
                  <h1>Account info</h1>
                  <div
                    className="input-container"
                    style={{ marginBottom: "28px" }}
                  >
                    <p>Email<span className="required">*</span></p>
                    <input
                      name="email"
                      value={profile.email ?? ""}
                      onChange={handleProfileChange}
                      maxlength="55"
                      placeholder=" "
                    />
                    {errors.email ? (
                      <p className="error-style-p">{errors.email}</p>
                    ) : null}
                  </div>
                  <div className="input-container">
                    <p>Password</p>
                    <input type="password" placeholder=" " readOnly />
                  </div>

                  <p
                    onClick={() => setChangePasswordModal(true)}
                    className="change-pw-button"
                  >
                    +change password
                  </p>
                </div>
              </div>

              <div className="timezone-container">
                <h1>Time zone</h1>
                <p>Time Zone<span className="required">*</span></p>
                <div className="mail-list-head-div">
                  <div className="select-wrapper w-100">
                    <TimezoneSelect
                      instanceId="timezone"
                      value={selectedTimezone}
                      onChange={setSelectedTimezone}
                    />
                    {errors.timezone ? (
                      <p className="error-style-p">{errors.timezone}</p>
                    ) : null}                    
                  </div>
                  {/* <div className="time-text">{selectedTimezone.label}</div> */}
                  
                </div>
              </div>

              <div className="notification-container">
                <h1>Notifications & Subscriptions</h1>

                <p className="sub-heading">Send me email notification when</p>
                <div className="switch-div">
                  <div className="switch-text-div">
                    <Switch
                      onChange={setCardSentChecked}
                      checked={cardSentChecked}
                      onColor="#222C52"
                      offColor="#fff"
                      uncheckedIcon={false}
                      checkedIcon={false}
                      className="switch-style"
                    />
                    <label>cards are sent</label>
                  </div>
                </div>
                <div className="switch-div">
                  <div className="switch-text-div">
                    <Switch
                      onChange={setCardViewChecked}
                      checked={cardViewChecked}
                      onColor="#222C52"
                      offColor="#fff"
                      uncheckedIcon={false}
                      checkedIcon={false}
                      className="switch-style"
                    />
                    <label>cards are viewed</label>
                  </div>
                </div>
                <div className="switch-div mb-3">
                  <div className="switch-text-div">
                    <Switch
                      onChange={setMessageRecipientChecked}
                      checked={messageRecipientChecked}
                      onColor="#222C52"
                      offColor="#fff"
                      uncheckedIcon={false}
                      checkedIcon={false}
                      className="switch-style"
                    />
                    <label>my recipient messages me</label>
                  </div>
                </div>

                <p className="sub-heading">Subscriptions</p>
                <div className="switch-div">
                  <div className="switch-text-div">
                    <Switch
                      onChange={setSpecialOfferMailChecked}
                      onch
                      checked={specialOfferMailChecked}
                      onColor="#222C52"
                      offColor="#fff"
                      uncheckedIcon={false}
                      checkedIcon={false}
                      className="switch-style"
                    />
                    <label>
                      Yes, I would like to receive your newsletter and special
                      offers
                    </label>
                  </div>
                </div>
              </div>

              <div className="update-button-container">
                <button
                  disabled={profileState.loading}
                  onClick={handleUpdateProfile}
                >
                  Update info
                </button>
                
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
    </main>
  );
};

export default withAuthentication(AccountPage);
