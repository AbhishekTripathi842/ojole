import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "../../components/common/header";
import Meta from "../../components/common/meta";
import Image from "next/image";
import FooterComponent from "../../components/common/footer";
import { connect, useDispatch, useSelector } from "react-redux";
import { PasswordResetAction } from "../../store/actions/password-reset-action";
import LoadingScreen from "../../components/common/loader";

function ResetPasswordPage({ passwordResetResponse }) {
  const dispatch = useDispatch();
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    setToken(urlParams.get("token"));
    setEmail(urlParams.get("email"));
    passwordResetResponse.errors = "";
    passwordResetResponse.success = "";
  }, []);

  useEffect(() => {
    setLoading(false)
    passwordResetResponse.errors = "";
  }, [passwordResetResponse]);

  const ResetFn = () => {
    if (pwd === confirmPwd) {
      setLoading(true)
      setErrors("");
      let formData = new FormData();
      formData.append("email", email);
      formData.append("token", token);
      formData.append("password", pwd);
      formData.append("password_confirmation", confirmPwd);
      dispatch(PasswordResetAction(formData));
    } else {
      setErrors("Please make sure to match your password.");
    }
  };
  return (
    <main>
      <Head>
        <title>Reset Password</title>
        <Meta />
      </Head>
      {loading  ? 
       <LoadingScreen></LoadingScreen> :''
      }      
      <Header tokenData={(data)=>setToken(data)} />

      <div className="reset-password-wrapper">
        <div className="reset-password-container">
          <div className="reset-password-section">
            <div className="title">Reset Your Password</div>
            <div className="input-container">
              <p>New Password</p>
              <input
                type="password"
                placeholder=""
                onChange={(e) =>{ return setPwd(e.target.value),setErrors("")}}
              />
              {passwordResetResponse.errors ? (
                <p className="error-style-p">
                  {passwordResetResponse.errors.password}
                </p>
              ) : null}
            </div>
            <div className="input-container">
              <p>Confirm New Password</p> 
              <input
                type="password"
                placeholder=""
                onChange={(e) => { return setConfirmPwd(e.target.value),setErrors("")}}
              />
              {passwordResetResponse.errors ? (
                <p className="error-style-p">
                  {passwordResetResponse.errors.email}
                </p>
              ) : null}
              {errors ? <p className="error-style-p">{errors}</p> : null}
              {passwordResetResponse.success ? (
                <p
                  className="title"
                  style={{
                    color: "green",
                    marginTop: "20px",
                    textAlign: "center",
                  }}
                >
                  {passwordResetResponse.message}
                </p>
              ) : null}
            </div>
            <button onClick={() => ResetFn()}>Reset password</button>
          </div>
        </div>
      </div>
      <FooterComponent />
    </main>
  );
}

export default connect((state) => ({
  passwordResetResponse: state.passwordResetResponse,
}))(ResetPasswordPage);
