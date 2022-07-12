import React from "react"
import IMG from "../../public/images/loading-buffering.gif"

const LoadingScreen = () => {
  return (
    <div className="loader"><img src={IMG.src} ></img></div>
  );
};

export default LoadingScreen;