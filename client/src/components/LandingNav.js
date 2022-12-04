import React from "react";
import { TiThMenu } from "react-icons/ti";
import { useGlobalContext } from "../context/UserContext";
const LandingNav = () => {
  const { toggleNav } = useGlobalContext();
  return (
    <header className="header ">
      <div className=" container flex justify-between items-center ">
        <img
          src="./assets/logo.png"
          alt="logo"
          className="logo mb-1 img rounded-full"
        />

        <div className=" title">YKDatas</div>
        <div onClick={() => toggleNav()} className="hamburger ">
          <TiThMenu />
        </div>
        <div className="big__nav">big nav</div>
      </div>
    </header>
  );
};

export default LandingNav;
